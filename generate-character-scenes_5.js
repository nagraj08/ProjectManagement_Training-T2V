// ═══════════════════════════════════════════════
// PM Leadership Video Generator
// 5 Scenes — Project Management Series
// Run: node generate-character-scenes_5.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const API_KEY = "Use_YourAPI_Key_Here";

const T2V_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const TTS_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const TASK_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/";

const AUDIO_FOLDER = "E:\\NB\\Frames\\pmleadership\\audio";
const VIDEO_FOLDER = "E:\\NB\\Frames\\pmleadership\\video";
const IMAGE_FOLDER = "E:\\NB\\Frames\\pmleadership\\image";

// ════════════════════════════════════════════════
// 🎬 SCENE DEFINITIONS — PM Leadership Series
// ════════════════════════════════════════════════
const SCENES = [

  // ── Scene 1: Leading Without Authority (0:00 – 1:15) ──
  {
    scene: 1,
    title: "Leading_Without_Authority",
    type: "T2V",
    timeRange: "0:00 - 1:15",
    voice: "Ethan",
    visualPrompt: "A digital drawing of a traditional corporate org chart with solid hierarchical lines, then slowly the solid lines begin to fade and are replaced by a complex glowing web of dotted lines connecting a central Project Manager node to multiple team members across departments, the web grows and pulses with soft light showing influence without authority, professional corporate animation style, dark background with glowing blue and white lines, 4K cinematic quality",
    musicPrompt: "Deep resonant cello or slow rhythmic bass beat, weighty and grounded feel, sense of responsibility and gravity, low frequency orchestral undertones",
    script: "Let's start with a reality check. As a Project Manager, you rarely have the power to hire, fire, or promote anyone on your team. You are often expected to deliver results from people who don't technically report to you. Think about that: Who here has zero direct reports but full delivery responsibility? In this environment, your only real authority is clarity, consistency, and trust. Those three things are more powerful than any org chart title. Influence isn't about giving orders; it's about being the person the team wants to follow because they know exactly where you're going and they trust you'll get them there."
  },

  // ── Scene 2: Managing the Multi-Project Load (1:15 – 2:30) ──
  {
    scene: 2,
    title: "Managing_the_Multi_Project_Load",
    type: "T2V",
    timeRange: "1:15 - 2:30",
    voice: "Ethan",
    visualPrompt: "Split screen professional comparison: left side shows a stressed person frantically juggling multiple glass balls in the air with a chaotic overwhelmed expression, balls falling and shattering, right side shows a calm strategic chess player coolly surveying three chess boards simultaneously and making one precise deliberate move, confident and in control, professional cinematic style, warm and cool lighting contrast between the two sides, 4K quality",
    musicPrompt: "Rhythmic ticking tempo that feels urgent but controlled, measured clock-like beat, strategic tension with underlying confidence, corporate thriller feel",
    script: "Managing multiple projects is not about doing everything simultaneously. That is a recipe for burnout and failure. Instead, it is the art of knowing precisely which project needs you most today, tomorrow, and next week — long before a crisis tells you first. I want you to try something. Write down every active project you are managing right now. Note its RAG status — Red, Amber, or Green. Now, write down the one most urgent action needed for each — right now. If you can't do that in under four minutes, you aren't managing by system; you're managing by memory and anxiety. The professional PM knows that attention is their most limited resource. Spend it where it moves the needle, not where the loudest person is shouting."
  },

  // ── Scene 3: The Ownership Mindset (2:30 – 4:00) ──
  {
    scene: 3,
    title: "The_Ownership_Mindset",
    type: "T2V",
    timeRange: "2:30 - 4:00",
    voice: "Ethan",
    visualPrompt: "A horizontal spectrum scale appearing on screen, on the far left a person shrugging with shoulders raised and arms spread in a dismissive gesture with text overlay It is not my problem, on the far right a sharp-eyed professional engineer pointing urgently at a small crack appearing in a large dam wall before it breaks with text overlay I see a risk let me report it, the spectrum glows from red on the left to green on the right, cinematic atmospheric style, slow dramatic build, 4K quality",
    musicPrompt: "Atmospheric and cinematic slow build-up creating a sense of integrity and moral weight, deep sustained strings, rising sense of professional responsibility, thoughtful and serious tone",
    script: "Ownership is not a job title — it is a daily decision. The moment you think that is someone else's problem, you have stopped being a project professional and started being a bystander. Be honest with yourself: where does your team sit on the ownership spectrum? Do they say It's not my business? Or do they say I see a risk, let me report it? Ownership means you are the Chief Solution Officer. It doesn't mean you do all the work, but it means you never let a problem sit in a vacuum. A bystander watches the project fail. A professional owns the outcome, even when the obstacles aren't their fault."
  },

  // ── Scene 4: Accountability to Management (4:00 – 5:00) ──
  {
    scene: 4,
    title: "Accountability_to_Management",
    type: "T2V",
    timeRange: "4:00 - 5:00",
    voice: "Ethan",
    visualPrompt: "A professional whiteboard appearing on screen split into two clear sections: left side shows a vague smiley face icon with text The project is fine written casually, right side shows a detailed data graph with SPI value of 0.87 highlighted in amber with a clear three-step recovery plan arrow pointing upward labeled Recovery Plan Steps 1 2 3, a confident project manager presenting the right side to attentive executives in a modern boardroom, corporate professional style, clean data visualization, 4K cinematic",
    musicPrompt: "Slick professional corporate electronic music, confident and transparent feel, steady authoritative beat, modern business executive tone",
    script: "Your management does not fear bad news. They fear surprises. When you tell a sponsor The project is fine when it's actually behind, you aren't being positive — you're being dangerous. Compare these two updates: Everything is okay versus Our SPI is 0.87 this week — here is our recovery plan. Which PM would you trust with your most important project? The answer is instant and unanimous. Delivering difficult updates early, backed by data and a solution, makes you ten times more trusted than a PM who stays silent until the deadline has already passed. Professional accountability is the courage to speak the truth when it's still early enough to fix it."
  },

  // ── Scene 5: Final Reflection & Summary (5:00 – 5:45) ──
  {
    scene: 5,
    title: "Final_Reflection_and_Summary",
    type: "T2V",
    timeRange: "5:00 - 5:45",
    voice: "Ethan",
    visualPrompt: "Cinematic montage of a diverse IT project team celebrating a successful go-live in a modern Jakarta office, team members shaking hands and smiling with relief and pride, deployment screens showing all green success status, then slow cinematic fade to a stunning Jakarta sunset skyline with city lights beginning to glow, final inspirational quote appearing word by word over the skyline: Project Management is Leadership in Action, warm golden hour lighting, 8K cinematic photorealistic quality",
    musicPrompt: "Grand inspiring and triumphant resolution, full orchestral crescendo, sense of achievement and human leadership, powerful uplifting finale, memorable corporate inspirational score",
    script: "Project management is more than just tools and charts. It is the human element. It is the ability to lead when you don't have power, to prioritize when everything is urgent, to own the result when things get difficult, and to be the most honest person in the room. Take these principles into your next stand-up. Be the leader who brings clarity, not just tasks. Your title might say Project Manager, but your actions should say Leader. Let's get to work."
  }

];

// ════════════════════════════════════════════════
// Save music prompts reference
// ════════════════════════════════════════════════
function saveMusicReference() {
  if (!fs.existsSync(IMAGE_FOLDER)) fs.mkdirSync(IMAGE_FOLDER, { recursive: true });
  var refFile = path.join(IMAGE_FOLDER, "music_prompts_reference.txt");
  var content = "PM LEADERSHIP VIDEO — MUSIC PROMPTS REFERENCE\n";
  content += "Use these prompts on Suno.ai or Udio.com\n";
  content += "Lyria prompt: 30-second track, corporate-modern, inspiring, confident tempo,\n";
  content += "subtle synth pads with a driving percussive beat, high-fidelity\n";
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
  console.log("   📝 Script : " + (scene.script ? scene.script.length : "MISSING") + " characters");
  console.log("═══════════════════════════════════════════");

  if (!scene.script) { console.log("❌ Script missing for Scene " + scene.scene); return { scene: scene.scene, title: scene.title, status: "SCRIPT_MISSING" }; }

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
  console.log("⚡ PM Leadership — Video Generator");
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
  console.log("   1. Update merge-final-video.js paths to pmleadership folder");
  console.log("   2. Update SCENES titles in merge-final-video.js");
  console.log("   3. Add BGM files to E:\\NB\\Frames\\pmleadership\\bgm\\");
  console.log("   4. Run merge-final-video.js");
}

main();
