// ═══════════════════════════════════════════════
// ElectroAI — Auto Synced Video + Audio Generator
// Step 1: Generate audio → measure duration
// Step 2: Generate video matching audio duration
// Step 3: Save both with matching names
// Run: node generate-synced.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const API_KEY = "Use_YourAPI_Key_Here";
const TTS_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const VIDEO_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const TASK_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/";

const AUDIO_FOLDER = "E:\\NB\\Frames\\synced\\audio";
const VIDEO_FOLDER = "E:\\NB\\Frames\\synced\\video";

// ── 6 Scenes with script + video prompt ──
const SCENES = [
  /* {
    scene: 1,
    title: "Worried_Customer",
    voice: "Serena",
    script: "Hey, we have all been there. You ordered something online, and now? Total silence. No updates. No idea where your package is. Frustrating, right?",
    prompt: "Worried young woman sitting at home checking phone anxiously, waiting for delivery, realistic style, cinematic lighting, 4K"
  },
  {
    scene: 2,
    title: "Lost_Package_Warehouse",
    voice: "Serena",
    script: "Somewhere out there, your package is lost in a sea of boxes. The staff are overwhelmed, the system is outdated. And nobody has an answer for you. There has to be a better way.",
    prompt: "Chaotic warehouse with lost packages, confused workers, overwhelmed staff, boxes everywhere, realistic cinematic style, 4K"
  },
  {
    scene: 3,
    title: "Opens_ElectroAI_Chatbot",
    voice: "Serena",
    script: "That is exactly why we built ElectroAI. Just open the app, type your question, and our AI assistant TechBot is ready for you. Instantly. No waiting. No hold music.",
    prompt: "Woman typing on phone, modern AI chat interface glowing on screen, hopeful expression, futuristic UI, cinematic lighting, 4K"
  },
  {
    scene: 4,
    title: "TechBot_Finds_Order",
    voice: "Serena",
    script: "In seconds, TechBot finds your order, tracks your package in real time, and gives you all the answers you need. In your language, on your terms.",
    prompt: "AI chatbot interface showing order found, happy notification, green checkmark appearing, futuristic UI glow effect, modern technology"
  }, */
  {
    scene: 5,
    title: "Package_Arrives",
    voice: "Jennifer",
    script: "And just like that, problem solved! Your package arrives, right on time. No stress, no confusion. Just a smooth, happy shopping experience.",
    prompt: "Happy young woman receiving package at door, smiling joyfully, sunny day, warm cinematic lighting, realistic style, 4K"
  }/* ,
  {
    scene: 6,
    title: "ElectroAI_Logo_Closing",
    voice: "Ethan",
    script: "ElectroAI. Your smart electronics companion. Powered by Qwen AI on Alibaba Cloud. Because great technology should feel this easy. Try it today.",
    prompt: "Futuristic ElectroAI logo animation, orange glow effect, Alibaba Cloud powered text, clean dark background, cinematic quality"
  } */
];

function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

function createFolders() {
  [AUDIO_FOLDER, VIDEO_FOLDER].forEach(function(folder) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log("📁 Created: " + folder);
    }
  });
}

// ── Get MP3 duration from file buffer ──
function getMp3DurationSeconds(buffer) {
  try {
    // MP3 frame header detection to estimate duration
    var fileSize = buffer.length;
    // Scan for ID3 tag to skip it
    var offset = 0;
    if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
      var id3Size = ((buffer[6] & 0x7f) << 21) | ((buffer[7] & 0x7f) << 14) |
                   ((buffer[8] & 0x7f) << 7) | (buffer[9] & 0x7f);
      offset = id3Size + 10;
    }
    // Find first valid MP3 frame
    var bitrate = 128; // assume 128kbps
    for (var i = offset; i < Math.min(offset + 2000, buffer.length - 3); i++) {
      if (buffer[i] === 0xFF && (buffer[i+1] & 0xE0) === 0xE0) {
        var bitrateIndex = (buffer[i+2] >> 4) & 0x0F;
        var bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
        if (bitrates[bitrateIndex] > 0) {
          bitrate = bitrates[bitrateIndex];
          break;
        }
      }
    }
    var durationSeconds = (fileSize * 8) / (bitrate * 1000);
    return Math.ceil(durationSeconds);
  } catch (e) {
    return 10; // fallback 10 seconds
  }
}

// ── Step 1: Generate Audio ──
async function generateAudio(scene) {
  console.log("\n🎙️  Generating audio for Scene " + scene.scene + "...");
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
          input: {
            text: scene.script,
            voice: scene.voice
          }
        })
      });

      const data = await response.json();

      if (data.code === "Throttling.RateQuota") {
        console.log("⚠️  Rate limit. Waiting 20s...");
        await wait(20000);
        continue;
      }

      // Extract audio data
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
      } else {
        console.log("❌ Audio error: " + JSON.stringify(data).substring(0, 200));
        return null;
      }

      // Save audio file
      var filename = "Scene" + scene.scene + "_" + scene.title + ".mp3";
      var filepath = path.join(AUDIO_FOLDER, filename);
      var buffer;

      if (audioData) {
        buffer = Buffer.from(audioData, "base64");
      } else if (audioUrl) {
        const audioRes = await fetch(audioUrl);
        buffer = Buffer.from(await audioRes.arrayBuffer());
      }

      fs.writeFileSync(filepath, buffer);
      var duration = getMp3DurationSeconds(buffer);
      var sizekB = (buffer.length / 1024).toFixed(1);
      console.log("✅ Audio saved: " + filename + " (" + sizekB + " kB)");
      console.log("⏱️  Detected duration: ~" + duration + " seconds");
      return { filepath: filepath, duration: duration };

    } catch (err) {
      console.log("❌ Audio error: " + err.message);
      if (attempt < retries) { await wait(10000); }
    }
  }
  return null;
}

// ── Step 2: Submit Video Task ──
async function submitVideoTask(scene, duration) {
  console.log("\n🎬 Submitting video for Scene " + scene.scene + " (duration: " + duration + "s)...");

  // Wan models support 5s increments — round up to nearest 5
  var videoDuration = Math.ceil(duration / 5) * 5;
  videoDuration = Math.max(5, Math.min(videoDuration, 10)); // clamp 5-10s
  console.log("📐 Video duration set to: " + videoDuration + "s (rounded to nearest 5s)");

  var retries = 3;
  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(VIDEO_URL, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json",
          "X-DashScope-Async": "enable"
        },
        body: JSON.stringify({
          model: "wan2.6-t2v",
          input: { prompt: scene.prompt },
          parameters: {
            size: "1920*1080",
            watermark: true
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
        console.log("✅ Video submitted! Task ID: " + data.output.task_id);
        return data.output.task_id;
      } else {
        console.log("❌ Video submit failed: " + JSON.stringify(data).substring(0, 200));
        return null;
      }
    } catch (err) {
      console.log("❌ Error: " + err.message);
      if (attempt < retries) { await wait(10000); }
    }
  }
  return null;
}

// ── Step 3: Poll and Download Video ──
async function waitAndDownloadVideo(task_id, scene) {
  console.log("⏳ Waiting for video to generate...");
  for (var attempt = 1; attempt <= 80; attempt++) {
    await wait(15000);
    try {
      const response = await fetch(TASK_URL + task_id, {
        headers: { "Authorization": "Bearer " + API_KEY }
      });
      const data = await response.json();
      const status = data.output && data.output.task_status;
      const videoUrl = data.output && data.output.video_url;
      console.log("   [" + (attempt * 15) + "s] Status: " + status);

      if (status === "SUCCEEDED" && videoUrl) {
        // Download video
        console.log("⬇️  Downloading video...");
        var filename = "Scene" + scene.scene + "_" + scene.title + ".mp4";
        var filepath = path.join(VIDEO_FOLDER, filename);
        const videoRes = await fetch(videoUrl);
        const buffer = await videoRes.arrayBuffer();
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

// ── Process ONE scene completely ──
async function processScene(scene) {
  console.log("\n═══════════════════════════════════════════");
  console.log("🎬 PROCESSING SCENE " + scene.scene + "/" + SCENES.length + ": " + scene.title);
  console.log("═══════════════════════════════════════════");

  // Step 1: Generate audio and get duration
  var audioResult = await generateAudio(scene);
  if (!audioResult) {
    console.log("❌ Audio failed — skipping Scene " + scene.scene);
    return { scene: scene.scene, title: scene.title, status: "FAILED" };
  }

  // Step 2: Submit video with matching duration
  var task_id = await submitVideoTask(scene, audioResult.duration);
  if (!task_id) {
    console.log("❌ Video submit failed — skipping Scene " + scene.scene);
    return { scene: scene.scene, title: scene.title, status: "FAILED", audioPath: audioResult.filepath };
  }

  // Step 3: Wait and download video
  var videoPath = await waitAndDownloadVideo(task_id, scene);

  if (videoPath) {
    console.log("\n✅ Scene " + scene.scene + " COMPLETE!");
    console.log("   🎙️  Audio: " + audioResult.filepath);
    console.log("   🎬 Video: " + videoPath);
    console.log("   ⏱️  Audio duration: ~" + audioResult.duration + "s");
  }

  // Wait before next scene
  if (scene.scene < SCENES.length) {
    console.log("\n⏳ Waiting 5 seconds before next scene...");
    await wait(5000);
  }

  return {
    scene: scene.scene,
    title: scene.title,
    status: videoPath ? "DONE" : "VIDEO_FAILED",
    audioPath: audioResult.filepath,
    videoPath: videoPath,
    duration: audioResult.duration
  };
}

// ── Main ──
async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("⚡ ElectroAI — Synced Video + Audio Generator");
  console.log("   Audio Model: qwen3-tts-flash");
  console.log("   Video Model: wan2.6-t2v (1080P)");
  console.log("   Flow: Audio → Measure Duration → Match Video");
  console.log("═══════════════════════════════════════════");

  createFolders();

  var results = [];
  for (var i = 0; i < SCENES.length; i++) {
    var result = await processScene(SCENES[i]);
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
      console.log("\n✅ Scene " + r.scene + ": " + r.title + " (~" + r.duration + "s)");
      console.log("   🎙️  " + r.audioPath);
      console.log("   🎬 " + r.videoPath);
    } else {
      console.log("\n❌ Scene " + r.scene + ": " + r.title + " — " + r.status);
    }
  });

  console.log("\n🎉 " + successCount + "/6 synced pairs ready!");
  console.log("\n📂 Audio files: " + AUDIO_FOLDER);
  console.log("📂 Video files: " + VIDEO_FOLDER);
  console.log("\n📽️  In CapCut:");
  console.log("   1. Import Scene1 video + Scene1 audio → they match!");
  console.log("   2. Repeat for all 6 scenes");
  console.log("   3. Add background music at low volume (20-30%)");
  console.log("   4. Export final video!");
}

main();
