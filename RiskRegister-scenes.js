// ═══════════════════════════════════════════════
// Risk Management Video Generator
// 5 Scenes — Professional Corporate Style
// Run: node generate-character-scenes.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const API_KEY = "sk-8416cebc565f4a29859985e269834580";
const T2I_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis";
const I2V_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const T2V_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const TTS_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const TASK_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/";

const AUDIO_FOLDER = "E:\\NB\\Frames\\riskmanagement\\audio";
const VIDEO_FOLDER = "E:\\NB\\Frames\\riskmanagement\\video";
const IMAGE_FOLDER = "E:\\NB\\Frames\\riskmanagement\\image";

// ════════════════════════════════════════════════
// 🎬 SCENE DEFINITIONS — Risk Management Series
// ════════════════════════════════════════════════
const SCENES = [

  // ── Scene 1: The Mindset Shift (0:00 – 1:00) ──
  {
    scene: 1,
    title: "The_Mindset_Shift",
    type: "T2V",
    timeRange: "0:00 - 1:00",
    voice: "Ethan",
    visualPrompt: "Cinematic wide shots of a busy construction site transitioning to a high-tech server room with glowing screens, professional workers in hard hats and suits, dramatic moody lighting, text overlay reading Risk Management is not Risk Theatre in bold white font, ultra cinematic 4K quality, documentary style",
    musicPrompt: "Deep rhythmic synth with a sense of anticipation, building tension, dark atmospheric undertones, professional corporate feel, slow pulsing bass",
    script: "A risk register is not a pessimist's document — it is a professional's insurance policy. Most project teams treat risk management as a document they produce once at initiation and never open again. That isn't management; that's theater. The PM who identifies risks early sleeps soundly. The PM who discovers them at go-live does not sleep at all. Today, we move from being surprised by crises to anticipating them weeks in advance with a living, breathing response plan."
  },

  // ── Scene 2: The Architecture of the Register (1:00 – 2:30) ──
  {
    scene: 2,
    title: "The_Architecture_of_Register",
    type: "T2V",
    timeRange: "1:00 - 2:30",
    voice: "Ethan",
    visualPrompt: "A professional Risk Register spreadsheet table building up column by column on a large monitor screen, each column glowing and expanding as it appears, columns labeled Risk ID, Description, Category, Probability, Impact, Risk Score, Risk Owner, Mitigation, Contingency, Trigger, clean corporate office environment, dark blue UI theme, 4K cinematic quality",
    musicPrompt: "Clean steady analytical pulse, minimalist electronic beat, focused and methodical rhythm, corporate presentation feel, moderate tempo",
    script: "Let's break down the anatomy of a professional Risk Register. Every column exists for a specific reason. First, the Risk ID and Description. Vague risks produce vague responses. We need clear statements of what could go wrong. We then Categorize them — Technical, Schedule, or Resource — to look for patterns. But how do we prioritize? We use Probability and Impact. By multiplying these, we get an objective Risk Score. Crucially, every risk needs a Risk Owner. This must be a named individual, never a team. Because when everyone is responsible, no one is. Finally, we distinguish between Mitigation — what we do now to lower the odds — and Contingency — what we do if the fire starts. We look for the Trigger, that early warning sign that tells us it's time to act."
  },

  // ── Scene 3: The Matrix & Banking Case Study (2:30 – 3:30) ──
  {
    scene: 3,
    title: "The_Matrix_and_Banking_Case",
    type: "T2V",
    timeRange: "2:30 - 3:30",
    voice: "Ethan",
    visualPrompt: "A 3x3 Probability Impact Matrix grid appearing on screen with color coded cells, red cells for critical scores of 9, yellow for moderate scores of 6, green for low scores of 1 to 2, then transitioning to a scrolling professional table showing Bank Loan Portal Project risk register with rows highlighted, modern dark dashboard UI, data visualization style, 4K cinematic quality",
    musicPrompt: "Slightly faster tempo focused and math-heavy feel, sharp precise electronic beats, analytical tension, data driven energy, clean synth tones",
    script: "Visualizing these scores helps us focus. On our matrix, anything hitting a 9 is Critical, demanding immediate mitigation. A 1 or 2? We simply accept and note it. Take a Bank Loan Portal project as an example. A Critical risk, like Incomplete Core Banking API documentation, carries a score of 9. Our Tech Lead owns this. Conversely, Data Migration Volume might have a high impact but a low probability, giving it a score of 3. We monitor it, but we don't let it distract us from the 9s and 6s that could sink the project tomorrow."
  },

  // ── Scene 4: Industry Specifics (3:30 – 5:00) ──
  {
    scene: 4,
    title: "Industry_Specifics",
    type: "T2V",
    timeRange: "3:30 - 5:00",
    voice: "Ethan",
    visualPrompt: "Three distinct professional scenes transitioning smoothly: first a sleek modern bank building interior with financial data screens, then an insurance company office with shield icons and actuarial charts, then a large manufacturing factory floor with automated machinery and workers, each scene showing risk icons and mitigation strategies as text overlays, corporate documentary style, cinematic 4K",
    musicPrompt: "Varied musical textures transitioning between scenes, slick smooth jazz-influenced synth for banking, steady confident pulse for insurance, industrial rhythmic beat for manufacturing, professional documentary score",
    script: "Risk is contextual. In Banking, the OJK regulatory environment is your biggest hurdle. Mitigation? A 15% buffer and a dedicated compliance monitor. In Insurance, precision is everything. Actuarial calculation errors have zero tolerance. You need actuary sign-off on every piece of logic, and a data cleansing sprint before you ever touch a migration. In Manufacturing, the risk isn't just digital — it's physical. You can't stop a production line for a system test. Here, your mitigation involves testing during planned maintenance windows and managing the human risk of operator resistance to new technology."
  },

  // ── Scene 5: The Ritual & Conclusion (5:00 – 6:00) ──
  {
    scene: 5,
    title: "The_Ritual_and_Conclusion",
    type: "T2V",
    timeRange: "5:00 - 6:00",
    voice: "Ethan",
    visualPrompt: "A professional calendar interface on a large screen showing Weekly and Monthly review meetings highlighted in blue and orange, a project manager confidently presenting Top 5 risks to stakeholders in a modern boardroom, phase gate checkpoints appearing as milestones on a timeline, ending with inspirational quote on screen in bold white text on dark background, cinematic corporate style, 4K quality",
    musicPrompt: "Inspirational cinematic resolution, uplifting orchestral synth blend, sense of accomplishment and forward momentum, crescendo towards the end, professional documentary finale feel",
    script: "Finally, the Risk Review Ritual. A register reviewed monthly is just a compliance document. To make it a tool, you need a cadence. Weekly, spend 10 minutes with your team: Are there new risks? Have triggers fired? Monthly, spend 15 minutes with the client: Show them the Top 5 and how you are handling them. At every phase gate, re-score everything. The frequency of your review determines whether you are managing risks or just recording them. Start your ritual this week. Identify early, plan specifically, and sleep soundly."
  }

];

// ════════════════════════════════════════════════
// Save music prompts reference file
// ════════════════════════════════════════════════
function saveMusicReference() {
  var refFile = path.join(IMAGE_FOLDER, "music_prompts_reference.txt");
  var content = "RISK MANAGEMENT VIDEO — MUSIC PROMPTS REFERENCE\n";
  content += "Use these prompts on Suno.ai or Udio.com\n";
  content += "═══════════════════════════════════════════\n\n";
  SCENES.forEach(function(s) {
    content += "Scene " + s.scene + " [" + s.timeRange + "]: " + s.title.replace(/_/g, " ") + "\n";
    content += "BGM Prompt: " + s.musicPrompt + "\n\n";
  });
  fs.writeFileSync(refFile, content);
  console.log("🎵 Music reference saved: " + refFile);
}

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

// ── Generate Audio ──
async function generateAudio(scene) {
  console.log("🎙️  Generating audio... Voice: " + scene.voice);
  var retries = 3;
  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(TTS_URL, {
        method: "POST",
        headers: { "Authorization": "Bearer " + API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "qwen3-tts-flash",
          input: { text: scene.script, voice: scene.voice }
        })
      });
      const data = await response.json();
      if (data.code === "Throttling.RateQuota") { console.log("⚠️  Rate limit. Waiting 20s..."); await wait(20000); continue; }

      var audioData = null;
      var audioUrl  = null;
      if (data.output && data.output.audio && data.output.audio.data) audioData = data.output.audio.data;
      else if (data.output && data.output.audio && data.output.audio.url) audioUrl = data.output.audio.url;
      else if (data.output && data.output.choices) {
        var content = data.output.choices[0].message.content;
        for (var i = 0; i < content.length; i++) { if (content[i].audio) { audioData = content[i].audio; break; } }
      } else { console.log("❌ No audio in response: " + JSON.stringify(data).substring(0, 200)); return null; }

      var buffer;
      if (audioData) buffer = Buffer.from(audioData, "base64");
      else if (audioUrl) { const ar = await fetch(audioUrl); buffer = Buffer.from(await ar.arrayBuffer()); }

      var filename = "Scene" + scene.scene + "_" + scene.title + ".mp3";
      var filepath = path.join(AUDIO_FOLDER, filename);
      fs.writeFileSync(filepath, buffer);
      var duration = getMp3Duration(buffer);
      console.log("✅ Audio saved: " + filename + " (~" + duration + "s)");
      return { filepath: filepath, duration: duration };

    } catch(err) { console.log("❌ Error: " + err.message); if (attempt < retries) await wait(10000); }
  }
  return null;
}

// ── Submit Video Task ──
async function submitVideoTask(scene) {
  console.log("🎬 Submitting T2V video...");
  var retries = 3;
  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(T2V_URL, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json",
          "X-DashScope-Async": "enable"
        },
        body: JSON.stringify({
          model: "wan2.6-t2v",
          input: { prompt: scene.visualPrompt },
          parameters: { size: "1920*1080", watermark: true }
        })
      });
      const data = await response.json();
      if (data.code === "Throttling.RateQuota") { console.log("⚠️  Rate limit. Waiting 20s..."); await wait(20000); continue; }
      if (data.output && data.output.task_id) { console.log("✅ Video submitted: " + data.output.task_id); return data.output.task_id; }
      console.log("❌ Submit failed: " + JSON.stringify(data).substring(0, 200));
      if (attempt < retries) await wait(10000);
    } catch(err) { console.log("❌ Error: " + err.message); if (attempt < retries) await wait(10000); }
  }
  return null;
}

// ── Wait and Download Video ──
async function waitAndDownloadVideo(task_id, scene) {
  console.log("⏳ Waiting for video...");
  for (var i = 1; i <= 80; i++) {
    await wait(15000);
    try {
      const res = await fetch(TASK_URL + task_id, { headers: { "Authorization": "Bearer " + API_KEY } });
      const data = await res.json();
      var status   = data.output && data.output.task_status;
      var videoUrl = data.output && data.output.video_url;
      console.log("   [" + (i*15) + "s] Status: " + status);
      if (status === "SUCCEEDED" && videoUrl) {
        var filename = "Scene" + scene.scene + "_" + scene.title + ".mp4";
        var filepath = path.join(VIDEO_FOLDER, filename);
        const vr = await fetch(videoUrl);
        const buffer = await vr.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        console.log("✅ Video saved: " + filename + " (" + (buffer.byteLength/1024/1024).toFixed(2) + " MB)");
        return filepath;
      }
      if (status === "FAILED") { console.log("❌ Video generation failed!"); return null; }
    } catch(err) { console.log("   Poll error: " + err.message); }
  }
  return null;
}

// ── Process one full scene ──
async function processScene(scene) {
  console.log("\n═══════════════════════════════════════════");
  console.log("🎬 SCENE " + scene.scene + "/" + SCENES.length + ": " + scene.title.replace(/_/g, " "));
  console.log("   ⏰ Time range  : " + scene.timeRange);
  console.log("   🎵 Music mood  : " + scene.musicPrompt.substring(0, 70) + "...");
  console.log("   📝 Script len  : " + scene.script.length + " characters");
  console.log("═══════════════════════════════════════════");

  // Generate audio first
  var audioResult = await generateAudio(scene);
  if (!audioResult) return { scene: scene.scene, title: scene.title, status: "AUDIO_FAILED" };

  // Submit video
  var task_id = await submitVideoTask(scene);
  if (!task_id) return { scene: scene.scene, title: scene.title, status: "VIDEO_FAILED", audioPath: audioResult.filepath };

  // Wait and download
  var videoPath = await waitAndDownloadVideo(task_id, scene);

  if (videoPath) {
    console.log("\n✅ Scene " + scene.scene + " COMPLETE!");
    console.log("   🎙️  Audio    : " + audioResult.filepath);
    console.log("   🎬 Video    : " + videoPath);
    console.log("   ⏱️  Duration : ~" + audioResult.duration + "s");
  }

  if (scene.scene < SCENES.length) { console.log("\n⏳ Waiting 5s before next scene..."); await wait(5000); }

  return {
    scene: scene.scene,
    title: scene.title,
    timeRange: scene.timeRange,
    status: videoPath ? "DONE" : "VIDEO_FAILED",
    audioPath: audioResult.filepath,
    videoPath: videoPath,
    duration: audioResult.duration
  };
}

// ── Main ──
async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("⚡ Risk Management Video Generator");
  console.log("   Total scenes : " + SCENES.length);
  console.log("   Total duration: ~6 minutes");
  console.log("   Video model  : wan2.6-t2v (1080P)");
  console.log("   Audio model  : qwen3-tts-flash");
  console.log("   Voice        : Ethan (professional male)");
  console.log("═══════════════════════════════════════════");

  createFolders();
  saveMusicReference();

  var results = [];
  for (var i = 0; i < SCENES.length; i++) {
    var result = await processScene(SCENES[i]);
    results.push(result);
  }

  // Final summary
  console.log("\n═══════════════════════════════════════════");
  console.log("🎬 ALL SCENES COMPLETE — Summary:");
  console.log("═══════════════════════════════════════════");
  var successCount = 0;
  var totalDuration = 0;
  results.forEach(function(r) {
    if (r.status === "DONE") {
      successCount++;
      totalDuration += r.duration || 0;
      console.log("✅ [" + r.timeRange + "] Scene " + r.scene + ": " + r.title.replace(/_/g, " "));
      console.log("   🎙️  " + r.audioPath);
      console.log("   🎬 " + r.videoPath);
    } else {
      console.log("❌ Scene " + r.scene + ": " + r.title.replace(/_/g, " ") + " — " + r.status);
    }
  });

  console.log("\n🎉 " + successCount + "/" + SCENES.length + " scenes ready!");
  console.log("⏱️  Total audio duration: ~" + totalDuration + "s (~" + Math.round(totalDuration/60) + " mins)");
  console.log("\n📂 Audio  : " + AUDIO_FOLDER);
  console.log("📂 Video  : " + VIDEO_FOLDER);
  console.log("🎵 Music  : " + IMAGE_FOLDER + "\\music_prompts_reference.txt");
  console.log("\n📽️  Next: Run merge-final-video.js to combine into one file!");
}

main();
