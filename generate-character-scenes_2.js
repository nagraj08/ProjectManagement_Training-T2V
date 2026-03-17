// ═══════════════════════════════════════════════
// Burnout Prevention Video Generator
// 5 Scenes — Project Management Series
// Run: node generate-character-scenes.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const API_KEY = "Use_YourAPI_Key_Here";

const T2V_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const TTS_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const TASK_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/";

const AUDIO_FOLDER = "E:\\NB\\Frames\\burnout\\audio";
const VIDEO_FOLDER = "E:\\NB\\Frames\\burnout\\video";
const IMAGE_FOLDER = "E:\\NB\\Frames\\burnout\\image";

// ════════════════════════════════════════════════
// 🎬 SCENE DEFINITIONS — Burnout Prevention Series
// ════════════════════════════════════════════════
const SCENES = [

  // ── Scene 1: The Accountability Pivot (0:00 – 1:00) ──
  {
    scene: 1,
    title: "The_Accountability_Pivot",
    type: "T2V",
    timeRange: "0:00 - 1:00",
    voice: "Ethan",
    visualPrompt: "Close-up cinematic shots of an exhausted employee staring at a glowing screen in a dark office, deep shadows under eyes, stress and fatigue visible, then sharp transition to a confident project manager looking at a calendar with determination, text overlay reading Burnout is a Planning Failure in bold white font on dark background, documentary style, 4K cinematic quality",
    musicPrompt: "Somber low-frequency synth that slowly builds into a steady rhythmic heartbeat pulse, dark atmospheric opening, gradually intensifying",
    script: "Let's be direct about something rarely said in project management training. When your team is exhausted, stressed, and making more errors than usual — that is not a human resources problem. That is a project planning problem. Burnout is not a personal weakness; it is a planning failure. Somewhere in the past six weeks, a PM made decisions that put that team in that position. Unrealistic commitments were made. Scope was accepted without resource adjustment. Overtime was treated as a free resource. Today, we build the habits that ensure you never have to make those mistakes again."
  },

  // ── Scene 2: The Cause Chain (1:00 – 2:00) ──
  {
    scene: 2,
    title: "The_Cause_Chain",
    type: "T2V",
    timeRange: "1:00 - 2:00",
    voice: "Ethan",
    visualPrompt: "Animated professional flow chart labeled The Burnout Cause Chain appearing step by step on a dark screen, red Decision Point markers flashing at each stage, arrows connecting stages showing escalating pressure, stages include client request, scope accepted without timeline adjustment, pattern repeats, overtime locked in, exhaustion leads to errors, errors lead to skipped QA, bugs at go-live, more overtime, corporate presentation style, 4K cinematic",
    musicPrompt: "Ticking clock sound layered over a driving urgent bassline, building tension and urgency, mechanical rhythmic pulse, corporate thriller feel",
    script: "Look at the Burnout Cause Chain. It starts simply: a client requests a feature. At Decision Point One, the PM accepts it without adjusting the timeline. The team absorbs the work. At Decision Point Two, it happens again. A pattern is established. By Decision Point Three, the deadline is looming, and overtime is locked in. Notice the result: exhaustion leads to errors, errors lead to skipped QA, and bugs appear at go-live. The solution? More overtime. Count the moments where a different decision would have broken the chain. Burnout isn't inevitable; it's the result of small compromises that seemed reasonable at the time."
  },

  // ── Scene 3: The 80% Rule & The Board (2:00 – 3:30) ──
  {
    scene: 3,
    title: "The_80_Percent_Rule_and_Board",
    type: "T2V",
    timeRange: "2:00 - 3:30",
    voice: "Ethan",
    visualPrompt: "Split screen professional presentation: left side shows a 100 percent capacity bar cracking and breaking under pressure with red warning indicators, right side shows a steady 80 percent capacity bar with a green buffer zone labeled Safety Buffer, then transition to a Team Capacity Board dashboard showing team member workload indicators in Green Yellow and Red status, modern corporate dashboard UI, clean data visualization style, 4K cinematic quality",
    musicPrompt: "Lighter more efficient and rhythmic corporate tech track, steady confident beat, productive and organized feel, moderate upbeat tempo",
    script: "How do we prevent this? Practice One: The 80 percent Capacity Rule. If you have 40 hours, plan for 32. That remaining 20 percent isn't lazy time — it's the buffer that absorbs reality: unplanned client questions, bug fixes, and knowledge sharing. Maximum capacity is not maximum productivity; it is maximum brittleness. A team at 100 percent delivers less because the first unplanned event causes a cascade of delays. To manage this, use a Workload Visibility Board. When Budi or Siti hit 40 hours, they turn Red. Transparency is free. It allows overloaded members to feel seen and supported, and it lets others offer help before a crisis occurs."
  },

  // ── Scene 4: The Retrospective & The Trigger (3:30 – 4:30) ──
  {
    scene: 4,
    title: "The_Retrospective_and_Trigger",
    type: "T2V",
    timeRange: "3:30 - 4:30",
    voice: "Ethan",
    visualPrompt: "Simulated professional video call or modern meeting room with four retrospective questions appearing as speech bubbles: Who feels overwhelmed, What can we improve, What should we stop, What should we start, then transition to a clear Resource Trigger Protocol diagram showing three professional options: Remove other work, Add resources, Extend timeline, with a red No Entry sign appearing over Option D labeled Absorb it, clean corporate presentation style, 4K cinematic",
    musicPrompt: "Warm conversational and open acoustic-electronic hybrid, collaborative and thoughtful tone, human and approachable feel, gentle steady rhythm",
    script: "Every two weeks, you must check the pulse. Ask the hard questions: Who feels overwhelmed? and What can I, as your PM, do differently? These questions feel vulnerable, but they surface signals before they become resignation letters. And when new scope does arrive, use the Resource Trigger. There are only three professional options: Remove other work, add resources, or extend the timeline. Option D — expecting the team to just absorb it — does not exist in professional management. It is simply a path to quality failure."
  },

  // ── Scene 5: Early Warning Signals (4:30 – 5:30) ──
  {
    scene: 5,
    title: "Early_Warning_Signals",
    type: "T2V",
    timeRange: "4:30 - 5:30",
    voice: "Ethan",
    visualPrompt: "Professional dashboard of Human Indicators showing three warning icons: Increased Errors icon with upward red arrow, Withdrawal from Meetings icon showing empty chair, Late Hours icon showing clock at 8 PM, each indicator glowing as narrator mentions them, then warm transition to a supportive project manager having a genuine caring conversation with a team member in a bright modern office, inspiring and hopeful closing shot, 4K cinematic documentary style",
    musicPrompt: "Inspiring thoughtful and confident resolution, warm orchestral synth blend, sense of hope and empowerment, uplifting crescendo towards end, professional documentary finale"    ,
    script: "Finally, learn to read the human indicators. Increased errors from a top performer, withdrawal from meetings, or a developer consistently online at 8 PM — these are your early warning signals. These signals appear weeks before a major failure. Train yourself to read your team as carefully as you read your project dashboard. The most valuable data isn't always in a spreadsheet — it's in a team member's demeanor on a Tuesday morning. Be the PM who protects the engine, not the one who runs it into the ground."
  }

];

// ════════════════════════════════════════════════
// Save music prompts reference file
// ════════════════════════════════════════════════
function saveMusicReference() {
  if (!fs.existsSync(IMAGE_FOLDER)) fs.mkdirSync(IMAGE_FOLDER, { recursive: true });
  var refFile = path.join(IMAGE_FOLDER, "music_prompts_reference.txt");
  var content = "BURNOUT PREVENTION VIDEO — MUSIC PROMPTS REFERENCE\n";
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
  console.log("⏳ Waiting for video to generate...");
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
  console.log("⚡ Burnout Prevention — Video Generator");
  console.log("   Total scenes  : " + SCENES.length);
  console.log("   Total duration: ~5:30 minutes");
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
  console.log("\n📽️  Next: Update merge-final-video.js paths and run!");
}

main();
