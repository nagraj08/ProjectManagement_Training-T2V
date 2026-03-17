// ═══════════════════════════════════════════════
// Quality Assurance Video Generator
// 5 Scenes — Project Management Series
// Run: node generate-character-scenes_3.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const API_KEY = "Use_YourAPI_Key_Here";

const T2V_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const TTS_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const TASK_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/";

const AUDIO_FOLDER = "E:\\NB\\Frames\\qualityassurance\\audio";
const VIDEO_FOLDER = "E:\\NB\\Frames\\qualityassurance\\video";
const IMAGE_FOLDER = "E:\\NB\\Frames\\qualityassurance\\image";

// ════════════════════════════════════════════════
// 🎬 SCENE DEFINITIONS — QA Series
// ════════════════════════════════════════════════
const SCENES = [

  // ── Scene 1: The Visceral Cost of Shortcuts (0:00 – 1:15) ──
  {
    scene: 1,
    title: "The_Visceral_Cost_of_Shortcuts",
    type: "T2V",
    timeRange: "0:00 - 1:15",
    voice: "Ethan",
    visualPrompt: "A digital clock ticking rapidly in close-up, then screen splits dramatically: left side shows green text Time Saved 1 Week, right side shows red flashing text Emergency Overtime 3 Weeks, both sides animated with urgency, then transition to a stressed development team at computers with error screens and critical bug alerts flashing, text overlay reading Quality is not the last step it is every step in bold white font, dark corporate cinematic style, 4K quality",
    musicPrompt: "Low tense orchestral strings building intensity, sounds of digital glitch effects that resolve into a heavy driving beat, dramatic tension, cinematic thriller feel",
    script: "Quality is never the last step — it is every step. A team that skips QA to save one week will spend three weeks fixing what a proper cycle would have caught in three days. Imagine this: The project is two weeks behind. Under pressure, the decision is made to skip the QA cycle. You go live. Within 48 hours, critical bugs appear in the production system. Real users, real transactions, real consequences. The time saved wasn't just lost — it was multiplied. You are now fixing issues on a live battlefield instead of a controlled testing environment."
  },

  // ── Scene 2: The Integrated Model (1:15 – 2:30) ──
  {
    scene: 2,
    title: "The_Integrated_Model",
    type: "T2V",
    timeRange: "1:15 - 2:30",
    voice: "Ethan",
    visualPrompt: "A clean horizontal project timeline visualization on a dark screen, phases labeled Requirements, Design, Development, Integration, System Testing, UAT appearing left to right, instead of QA appearing as a single block at the end a glowing rhythmic QA Pulse beats underneath every phase simultaneously like a heartbeat, each phase lights up as narrator mentions it, professional project management dashboard style, clean corporate UI, 4K cinematic quality",
    musicPrompt: "Clean rhythmic and building electronic pulse representing a well-oiled machine, steady confident beat, methodical and organized feel, moderate upbeat corporate tempo",
    script: "QA is not a phase; it is a discipline that runs through every stage of the project. In the Requirements Phase, we ask: is this testable? In Design, we ensure the architecture actually supports the goal. During Development, we don't just write code; we perform unit tests and peer reviews. By the time we hit Integration and System Testing, we aren't hoping it works — we are verifying that the modules play well together. We do this so that when we reach UAT, it isn't a bug-hunting expedition for the client. It's a formal confirmation that the business process works."
  },

  // ── Scene 3: The Five Non-Negotiables (2:30 – 4:00) ──
  {
    scene: 3,
    title: "The_Five_Non_Negotiables",
    type: "T2V",
    timeRange: "2:30 - 4:00",
    voice: "Ethan",
    visualPrompt: "A professional Manifesto style list appearing point by point on screen with bold numbered entries: 1 Test Cases Written Before Development, 2 Separate QA Environment, 3 Severity Classification showing S1 to S4 scale, 4 Regression Testing, 5 QA Sign-off, each point glowing as it appears, then transition to an Environment Architecture diagram showing four isolated boxes labeled Dev, QA, UAT, Production with firewall barriers clearly separating each environment, professional corporate presentation style, dark blue UI theme, 4K cinematic",
    musicPrompt: "Authoritative and steady percussive and clear beat, commanding corporate rhythm, confident and non-negotiable feel, strong methodical pulse",
    script: "At our firm, we have five non-negotiables. First: Test cases are written before development starts. This defines what must be built, rather than just testing what was built. Second: A Separate QA Environment. In the banking sector, testing in production is not just poor practice — it's a regulatory hazard. One wrong transaction can trigger a legal incident. Third: Severity Classification. If every bug is a priority, nothing is. We fix S1 critical issues in 4 hours; cosmetic S4 issues can wait for the next sprint. Fourth: Regression Testing. Fixing one thing often breaks another. After every fix, we re-run our cases. And fifth: QA Sign-off. We never use our clients as free QA resources. We sign off internally before they ever see the system."
  },

  // ── Scene 4: The Pressure Response (4:00 – 5:00) ──
  {
    scene: 4,
    title: "The_Pressure_Response",
    type: "T2V",
    timeRange: "4:00 - 5:00",
    voice: "Ethan",
    visualPrompt: "Split screen professional chat dialogue interface, left side shows Management icon with message Skip QA we are behind schedule, right side shows PM icon with confident professional response text appearing word by word as narrator speaks, dialogue bubbles appearing in sequence showing risk analysis and structured middle ground proposal, then transition to a confident project manager presenting a compressed QA plan on a whiteboard to stakeholders, calm professional corporate meeting room, 4K cinematic quality",
    musicPrompt: "Thoughtful diplomatic yet firm piano and synth blend, measured and professional tone, calm confidence under pressure, steady resolution building",
    script: "What do you do when management says Skip QA? A professional PM doesn't just say No. They present the risk. Tell them: If we skip QA, the client will find our internal bugs. This damages their confidence. Every bug they find takes three times longer to fix than if we found it ourselves. If we fail UAT, the delay will be longer than the QA time we are trying to save. Then, offer the middle ground: Let's compress QA. We will perform a 3-day smoke test on the 10 most critical business scenarios. Always present the risk, then offer a structured path forward."
  },

  // ── Scene 5: Conclusion & Summary (5:00 – 5:45) ──
  {
    scene: 5,
    title: "Conclusion_and_Summary",
    type: "T2V",
    timeRange: "5:00 - 5:45",
    voice: "Ethan",
    visualPrompt: "High speed montage of successful project go-live moments: teams cheering in modern offices, green deployment success screens, clients shaking hands, project dashboards showing all green status, happy developers celebrating, then slow cinematic fade to a clean dark background with bold inspiring quote appearing word by word: Quality is the foundation of professional trust, grand cinematic closing shot, warm professional lighting, 4K documentary style",
    musicPrompt: "Grand cinematic and triumphant resolution, full orchestral synth crescendo, sense of achievement and professional pride, powerful uplifting finale, inspirational corporate score"    ,
    script: "Quality Assurance is the difference between a project that survives and a project that thrives. By weaving QA into every phase, respecting our environments, and standing firm on our non-negotiables, we protect our team, our clients, and our reputation. Let's make quality our baseline, not our afterthought. Your next project starts with a test plan — not a prayer."
  }

];

// ════════════════════════════════════════════════
// Save music prompts reference
// ════════════════════════════════════════════════
function saveMusicReference() {
  if (!fs.existsSync(IMAGE_FOLDER)) fs.mkdirSync(IMAGE_FOLDER, { recursive: true });
  var refFile = path.join(IMAGE_FOLDER, "music_prompts_reference.txt");
  var content = "QUALITY ASSURANCE VIDEO — MUSIC PROMPTS REFERENCE\n";
  content += "Use these prompts on Suno.ai or Udio.com\n";
  content += "═══════════════════════════════════════════\n\n";
  SCENES.forEach(function(s) {
    content += "Scene " + s.scene + " [" + s.timeRange + "]: " + s.title.replace(/_/g, " ") + "\n";
    content += "BGM Prompt : " + s.musicPrompt + "\n";
    content += "BGM File   : scene" + s.scene + "_bgm.mp3\n\n";
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
      } else { console.log("❌ No audio: " + JSON.stringify(data).substring(0, 200)); return null; }

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
  console.log("🎬 Submitting T2V video (wan2.6-t2v 1080P)...");
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
      if (data.output && data.output.task_id) { console.log("✅ Submitted! Task: " + data.output.task_id); return data.output.task_id; }
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
        console.log("⬇️  Downloading...");
        const vr = await fetch(videoUrl);
        const buffer = await vr.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        console.log("✅ Saved: " + filename + " (" + (buffer.byteLength/1024/1024).toFixed(2) + " MB)");
        return filepath;
      }
      if (status === "FAILED") { console.log("❌ Video failed!"); return null; }
    } catch(err) { console.log("   Poll error: " + err.message); }
  }
  return null;
}

// ── Process one full scene ──
async function processScene(scene) {
  console.log("\n═══════════════════════════════════════════");
  console.log("🎬 SCENE " + scene.scene + "/" + SCENES.length + ": " + scene.title.replace(/_/g, " "));
  console.log("   ⏰ Time    : " + scene.timeRange);
  console.log("   🎵 Music  : " + scene.musicPrompt.substring(0, 70) + "...");
  console.log("   📝 Script : " + scene.script.length + " characters");
  console.log("═══════════════════════════════════════════");

  var audioResult = await generateAudio(scene);
  if (!audioResult) return { scene: scene.scene, title: scene.title, status: "AUDIO_FAILED" };

  var task_id = await submitVideoTask(scene);
  if (!task_id) return { scene: scene.scene, title: scene.title, status: "VIDEO_FAILED", audioPath: audioResult.filepath };

  var videoPath = await waitAndDownloadVideo(task_id, scene);

  if (videoPath) {
    console.log("\n✅ Scene " + scene.scene + " COMPLETE!");
    console.log("   🎙️  Audio : " + audioResult.filepath);
    console.log("   🎬 Video : " + videoPath);
    console.log("   ⏱️  Duration: ~" + audioResult.duration + "s");
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
  console.log("⚡ Quality Assurance — Video Generator");
  console.log("   Total scenes  : " + SCENES.length);
  console.log("   Total duration: ~5:45 minutes");
  console.log("   Video model   : wan2.6-t2v (1080P)");
  console.log("   Audio model   : qwen3-tts-flash");
  console.log("   Voice         : Ethan (professional male)");
  console.log("═══════════════════════════════════════════");

  createFolders();
  saveMusicReference();

  var results = [];
  for (var i = 0; i < SCENES.length; i++) {
    var result = await processScene(SCENES[i]);
    results.push(result);
  }

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
  console.log("⏱️  Total audio: ~" + totalDuration + "s (~" + Math.round(totalDuration/60) + " mins)");
  console.log("\n📂 Audio : " + AUDIO_FOLDER);
  console.log("📂 Video : " + VIDEO_FOLDER);
  console.log("🎵 Music : " + IMAGE_FOLDER + "\\music_prompts_reference.txt");
  console.log("\n📽️  Next steps:");
  console.log("   1. Update merge-final-video.js paths to qualityassurance folder");
  console.log("   2. Add BGM files to E:\\NB\\Frames\\qualityassurance\\bgm\\");
  console.log("   3. Run merge-final-video.js");
}

main();
