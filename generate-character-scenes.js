// ═══════════════════════════════════════════════
// ElectroAI — Consistent Character Video Generator
// Step 1: Generate character image (Text-to-Image)
// Step 2: Use character image for Scenes 1, 3, 5 (I2V)
// Step 3: Use text prompts for Scenes 2, 4, 6 (T2V)
// Step 4: Generate audio for all scenes
// Run: node generate-character-scenes.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const API_KEY = "Use_YourAPI_Key_Here";

// API endpoints
const T2I_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis";
const I2V_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const T2V_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const TTS_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const TASK_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/";
const OSS_UPLOAD_CHECK = "https://dashscope-intl.aliyuncs.com/api/v1/uploads";

const AUDIO_FOLDER = "E:\\NB\\Frames\\character\\audio";
const VIDEO_FOLDER = "E:\\NB\\Frames\\character\\video";
const IMAGE_FOLDER = "E:\\NB\\Frames\\character\\image";

// ── Character description — used consistently across all scenes ──
const CHARACTER = "Young Southeast Asian woman, late 20s, shoulder length black hair, wearing a light blue casual shirt, warm friendly face, realistic style, cinematic quality";

// ── All 6 Scenes ──
const SCENES = [
  {
    scene: 1,
    title: "Worried_Customer",
    type: "I2V", // uses character image
    voice: "Jennifer",
    script: "Hey, we have all been there. You ordered something online, and now? Total silence. No updates. No idea where your package is. Frustrating, right?",
    prompt: CHARACTER + ", sitting at home on sofa, checking phone anxiously, worried expression, waiting for delivery, warm indoor lighting, cinematic 4K"
  },
  {
    scene: 2,
    title: "Lost_Package_Warehouse",
    type: "T2V", // no character needed
    voice: "Jennifer",
    script: "Somewhere out there, your package is lost in a sea of boxes. The staff are overwhelmed, the system is outdated. And nobody has an answer for you. There has to be a better way.",
    prompt: "Chaotic warehouse with lost packages, confused workers, overwhelmed staff, boxes everywhere, realistic cinematic style, 4K"
  },
  {
    scene: 3,
    title: "Opens_ElectroAI_Chatbot",
    type: "I2V", // uses character image
    voice: "Jennifer",
    script: "That is exactly why we built ElectroAI. Just open the app, type your question, and our AI assistant TechBot is ready for you. Instantly. No waiting. No hold music.",
    prompt: CHARACTER + ", sitting at desk, typing on phone with hopeful expression, modern AI chat interface glowing on screen, futuristic UI, cinematic lighting 4K"
  },
  {
    scene: 4,
    title: "TechBot_Finds_Order",
    type: "T2V", // no character needed
    voice: "Jennifer",
    script: "In seconds, TechBot finds your order, tracks your package in real time, and gives you all the answers you need. In your language, on your terms.",
    prompt: "AI chatbot interface showing order found, happy notification, green checkmark appearing, futuristic UI glow effect, modern technology, 4K"
  },
  {
    scene: 5,
    title: "Package_Arrives",
    type: "I2V", // uses character image
    voice: "Jennifer",
    script: "And just like that, problem solved! Your package arrives, right on time. No stress, no confusion. Just a smooth, happy shopping experience.",
    prompt: CHARACTER + ", standing at front door, receiving delivery package, big happy smile, sunny day, warm natural lighting, cinematic 4K"
  },
  {
    scene: 6,
    title: "ElectroAI_Logo_Closing",
    type: "T2V", // no character needed
    voice: "Ethan",
    script: "ElectroAI. Your smart electronics companion. Powered by Qwen AI on Alibaba Cloud. Because great technology should feel this easy. Try it today.",
    prompt: "Futuristic ElectroAI logo animation, orange glow effect, Alibaba Cloud powered text, clean dark background, cinematic quality, 4K"
  }
];

function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

function createFolders() {
  [AUDIO_FOLDER, VIDEO_FOLDER, IMAGE_FOLDER].forEach(function(folder) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log("📁 Created: " + folder);
    }
  });
}

// ── Get MP3 duration ──
function getMp3Duration(buffer) {
  try {
    var fileSize = buffer.length;
    var bitrate = 128;
    var offset = 0;
    if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
      var id3Size = ((buffer[6] & 0x7f) << 21) | ((buffer[7] & 0x7f) << 14) |
                   ((buffer[8] & 0x7f) << 7) | (buffer[9] & 0x7f);
      offset = id3Size + 10;
    }
    for (var i = offset; i < Math.min(offset + 2000, buffer.length - 3); i++) {
      if (buffer[i] === 0xFF && (buffer[i+1] & 0xE0) === 0xE0) {
        var brIndex = (buffer[i+2] >> 4) & 0x0F;
        var brs = [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0];
        if (brs[brIndex] > 0) { bitrate = brs[brIndex]; break; }
      }
    }
    return Math.ceil((fileSize * 8) / (bitrate * 1000));
  } catch(e) { return 10; }
}

// ══════════════════════════════════════════
// STEP 1: Generate Character Image (T2I)
// ══════════════════════════════════════════
async function generateCharacterImage() {
  console.log("\n═══════════════════════════════════════════");
  console.log("👤 STEP 1: Generating Consistent Character Image");
  console.log("═══════════════════════════════════════════");
  console.log("📝 Character: " + CHARACTER.substring(0, 80) + "...");

  var retries = 3;
  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log("📤 Submitting image generation (attempt " + attempt + ")...");
      const response = await fetch(T2I_URL, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json",
          "X-DashScope-Async": "enable"
        },
        body: JSON.stringify({
          model: "wanx2.1-t2i-turbo",
          input: {
            prompt: CHARACTER + ", neutral standing pose, plain white background, full body portrait, high quality, consistent reference image"
          },
          parameters: {
            size: "1024*1024",
            n: 1
          }
        })
      });

      const data = await response.json();

      if (data.code === "Throttling.RateQuota") {
        console.log("⚠️  Rate limit. Waiting 20s...");
        await wait(20000);
        continue;
      }

      if (data.output && data.output.task_id) {
        console.log("✅ Image task submitted! Task ID: " + data.output.task_id);
        // Poll for image result
        var imageUrl = await pollImageTask(data.output.task_id);
        if (imageUrl) {
          // Download and save image
          var imagePath = path.join(IMAGE_FOLDER, "character_reference.png");
          console.log("⬇️  Downloading character image...");
          const imgRes = await fetch(imageUrl);
          const imgBuffer = await imgRes.arrayBuffer();
          fs.writeFileSync(imagePath, Buffer.from(imgBuffer));
          console.log("✅ Character image saved: " + imagePath);
          return { path: imagePath, url: imageUrl };
        }
      } else {
        console.log("❌ Image generation failed: " + JSON.stringify(data).substring(0, 200));
        if (attempt < retries) { await wait(10000); }
      }
    } catch (err) {
      console.log("❌ Error: " + err.message);
      if (attempt < retries) { await wait(10000); }
    }
  }
  return null;
}

// ── Poll image task ──
async function pollImageTask(task_id) {
  console.log("⏳ Waiting for character image...");
  for (var i = 1; i <= 30; i++) {
    await wait(5000);
    try {
      const res = await fetch(TASK_URL + task_id, {
        headers: { "Authorization": "Bearer " + API_KEY }
      });
      const data = await res.json();
      var status = data.output && data.output.task_status;
      console.log("   [" + (i*5) + "s] Status: " + status);
      if (status === "SUCCEEDED") {
        var results = data.output && data.output.results;
        if (results && results[0] && results[0].url) {
          console.log("✅ Character image ready!");
          return results[0].url;
        }
      } else if (status === "FAILED") {
        console.log("❌ Image generation failed!");
        return null;
      }
    } catch (err) {
      console.log("   Poll error: " + err.message);
    }
  }
  return null;
}

// ══════════════════════════════════════════
// STEP 2: Generate Audio
// ══════════════════════════════════════════
async function generateAudio(scene) {
  console.log("🎙️  Generating audio...");
  var retries = 3;
  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "qwen3-tts-flash",
          input: { text: scene.script, voice: scene.voice }
        })
      });
      const data = await response.json();

      if (data.code === "Throttling.RateQuota") {
        console.log("⚠️  Rate limit. Waiting 20s...");
        await wait(20000);
        continue;
      }

      var audioData = null;
      var audioUrl = null;
      if (data.output && data.output.audio && data.output.audio.data) {
        audioData = data.output.audio.data;
      } else if (data.output && data.output.audio && data.output.audio.url) {
        audioUrl = data.output.audio.url;
      } else if (data.output && data.output.choices) {
        var content = data.output.choices[0].message.content;
        for (var i = 0; i < content.length; i++) {
          if (content[i].audio) { audioData = content[i].audio; break; }
        }
      }

      var buffer;
      if (audioData) {
        buffer = Buffer.from(audioData, "base64");
      } else if (audioUrl) {
        const ar = await fetch(audioUrl);
        buffer = Buffer.from(await ar.arrayBuffer());
      } else {
        console.log("❌ No audio data in response");
        return null;
      }

      var filename = "Scene" + scene.scene + "_" + scene.title + ".mp3";
      var filepath = path.join(AUDIO_FOLDER, filename);
      fs.writeFileSync(filepath, buffer);
      var duration = getMp3Duration(buffer);
      console.log("✅ Audio saved: " + filename + " (~" + duration + "s)");
      return { filepath: filepath, duration: duration };

    } catch (err) {
      console.log("❌ Audio error: " + err.message);
      if (attempt < retries) { await wait(10000); }
    }
  }
  return null;
}

// ══════════════════════════════════════════
// STEP 3: Generate Video (I2V or T2V)
// ══════════════════════════════════════════
async function submitVideoTask(scene, characterImageUrl) {
  var isCharacterScene = scene.type === "I2V";
  console.log("🎬 Submitting " + (isCharacterScene ? "I2V (with character)" : "T2V") + " video...");

  var requestBody;
  if (isCharacterScene && characterImageUrl) {
    // Image-to-Video — use character as first frame
    requestBody = {
      model: "wan2.1-i2v-turbo",
      input: {
        image_url: characterImageUrl,
        prompt: scene.prompt
      },
      parameters: {
        size: "1280*720",
        watermark: true
      }
    };
  } else {
    // Text-to-Video — no character needed
    requestBody = {
      model: "wan2.6-t2v",
      input: { prompt: scene.prompt },
      parameters: {
        size: "1920*1080",
        watermark: true
      }
    };
  }

  var retries = 3;
  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(isCharacterScene ? I2V_URL : T2V_URL, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json",
          "X-DashScope-Async": "enable"
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();

      if (data.code === "Throttling.RateQuota") {
        console.log("⚠️  Rate limit. Waiting 20s...");
        await wait(20000);
        continue;
      }

      if (data.output && data.output.task_id) {
        console.log("✅ Video submitted! Task ID: " + data.output.task_id);
        return data.output.task_id;
      } else {
        console.log("❌ Video submit failed: " + JSON.stringify(data).substring(0, 200));
        if (attempt < retries) { await wait(10000); }
      }
    } catch (err) {
      console.log("❌ Error: " + err.message);
      if (attempt < retries) { await wait(10000); }
    }
  }
  return null;
}

async function waitAndDownloadVideo(task_id, scene) {
  console.log("⏳ Waiting for video...");
  for (var i = 1; i <= 80; i++) {
    await wait(15000);
    try {
      const res = await fetch(TASK_URL + task_id, {
        headers: { "Authorization": "Bearer " + API_KEY }
      });
      const data = await res.json();
      var status = data.output && data.output.task_status;
      var videoUrl = data.output && data.output.video_url;
      console.log("   [" + (i*15) + "s] Status: " + status);
      if (status === "SUCCEEDED" && videoUrl) {
        console.log("⬇️  Downloading video...");
        var filename = "Scene" + scene.scene + "_" + scene.title + ".mp4";
        var filepath = path.join(VIDEO_FOLDER, filename);
        const vr = await fetch(videoUrl);
        const buffer = await vr.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        var sizeMB = (buffer.byteLength / 1024 / 1024).toFixed(2);
        console.log("✅ Video saved: " + filename + " (" + sizeMB + " MB)");
        return filepath;
      } else if (status === "FAILED") {
        console.log("❌ Video generation failed!");
        return null;
      }
    } catch (err) {
      console.log("   Poll error: " + err.message);
    }
  }
  return null;
}

// ── Process one full scene ──
async function processScene(scene, characterImageUrl) {
  console.log("\n═══════════════════════════════════════════");
  console.log("🎬 SCENE " + scene.scene + "/" + SCENES.length + ": " + scene.title);
  console.log("   Type: " + scene.type + (scene.type === "I2V" ? " 👤 (uses character)" : " 🎬 (no character)"));
  console.log("═══════════════════════════════════════════");

  // Generate audio
  var audioResult = await generateAudio(scene);
  if (!audioResult) {
    return { scene: scene.scene, title: scene.title, status: "AUDIO_FAILED" };
  }

  // Submit video
  var task_id = await submitVideoTask(scene, characterImageUrl);
  if (!task_id) {
    return { scene: scene.scene, title: scene.title, status: "VIDEO_FAILED", audioPath: audioResult.filepath };
  }

  // Wait and download
  var videoPath = await waitAndDownloadVideo(task_id, scene);

  if (videoPath) {
    console.log("\n✅ Scene " + scene.scene + " COMPLETE!");
    console.log("   🎙️  Audio: " + audioResult.filepath);
    console.log("   🎬 Video: " + videoPath);
  }

  if (scene.scene < SCENES.length) {
    console.log("\n⏳ Waiting 5 seconds before next scene...");
    await wait(5000);
  }

  return {
    scene: scene.scene,
    title: scene.title,
    type: scene.type,
    status: videoPath ? "DONE" : "VIDEO_FAILED",
    audioPath: audioResult.filepath,
    videoPath: videoPath,
    duration: audioResult.duration
  };
}

// ── Main ──
async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("⚡ ElectroAI — Consistent Character Generator");
  console.log("   Character scenes (I2V): 1, 3, 5");
  console.log("   Non-character scenes (T2V): 2, 4, 6");
  console.log("   Audio: qwen3-tts-flash");
  console.log("═══════════════════════════════════════════");

  createFolders();

  // Step 1: Generate character image ONCE
  var characterImage = await generateCharacterImage();
  if (!characterImage) {
    console.log("⚠️  Character image failed — will use T2V for all scenes");
  } else {
    console.log("\n👤 Character image ready: " + characterImage.path);
    console.log("🔗 Character URL: " + characterImage.url);
  }

  await wait(5000);

  // Step 2-4: Process all scenes
  var results = [];
  for (var i = 0; i < SCENES.length; i++) {
    var charUrl = characterImage ? characterImage.url : null;
    var result = await processScene(SCENES[i], charUrl);
    results.push(result);
  }

  // Final summary
  console.log("\n═══════════════════════════════════════════");
  console.log("🎬 ALL DONE! Final Summary:");
  console.log("═══════════════════════════════════════════");
  var successCount = 0;
  results.forEach(function(r) {
    if (r.status === "DONE") {
      successCount++;
      var tag = r.type === "I2V" ? "👤 Character" : "🎬 Generic";
      console.log("\n✅ Scene " + r.scene + " [" + tag + "]: " + r.title);
      console.log("   🎙️  " + r.audioPath);
      console.log("   🎬 " + r.videoPath);
    } else {
      console.log("\n❌ Scene " + r.scene + ": " + r.title + " — " + r.status);
    }
  });

  console.log("\n🎉 " + successCount + "/6 synced pairs ready!");
  console.log("\n📂 Images: " + IMAGE_FOLDER);
  console.log("📂 Audio:  " + AUDIO_FOLDER);
  console.log("📂 Video:  " + VIDEO_FOLDER);
  console.log("\n📽️  In CapCut:");
  console.log("   1. Import scenes in order (1→6)");
  console.log("   2. Drop matching audio under each video");
  console.log("   3. Add background music at 20% volume");
  console.log("   4. Export as MP4!");
}

main();
