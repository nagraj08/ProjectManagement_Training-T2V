// ═══════════════════════════════════════════════
// PM Communication Video Generator
// 5 Scenes — Project Management Series
// Run: node generate-character-scenes_6.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const API_KEY = "sk-8416cebc565f4a29859985e269834580";

const T2V_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const TTS_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const TASK_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/";

const AUDIO_FOLDER = "E:\\NB\\Frames\\pmcommunication\\audio";
const VIDEO_FOLDER = "E:\\NB\\Frames\\pmcommunication\\video";
const IMAGE_FOLDER = "E:\\NB\\Frames\\pmcommunication\\image";

// ════════════════════════════════════════════════
// 🎬 SCENE DEFINITIONS — PM Communication Series
// ════════════════════════════════════════════════
const SCENES = [

  // ── Scene 1: The WhatsApp Trap (0:00 – 1:15) ──
  {
    scene: 1,
    title: "The_WhatsApp_Trap",
    type: "T2V",
    timeRange: "0:00 - 1:15",
    voice: "Ethan",
    visualPrompt: "Close-up cinematic shot of a hand holding a smartphone with dozens of unread WhatsApp messages flooding the screen in green bubbles, a red Warning icon flashing urgently over the chat, overwhelming notifications piling up, then sharp transition to a clean professional PDF document on a laptop screen with a formal digital signature and official company letterhead, contrasting chaos versus professional order, 4K cinematic documentary style",
    musicPrompt: "Fast-paced slightly stressful electronic pulse that drops into a solid rhythmic beat, urgent opening that resolves into confident professionalism, corporate thriller to steady business feel",
    script: "Let's start with a question. Who here has ever confirmed a critical project decision over WhatsApp — only to find you couldn't prove it three months later when things went wrong? In the world of Banking and Insurance, clients live in a reality of audit trails and regulatory scrutiny. For them, every conversation that is not documented is a conversation that professionally, contractually, and legally never happened. WhatsApp is a great tool for where is the meeting, but it is a dangerous tool for change the scope. Your professional survival depends on the paper trail. If a decision is made in a chat, it must be followed by an email. No exception. Documentation isn't bureaucracy; it's your professional armor."
  },

  // ── Scene 2: The Coordinated Team (1:15 – 2:30) ──
  {
    scene: 2,
    title: "The_Coordinated_Team",
    type: "T2V",
    timeRange: "1:15 - 2:30",
    voice: "Ethan",
    visualPrompt: "Professional split screen comparison: left side shows isolated people working alone in separate floating bubbles disconnected from each other labeled The Parallel Team with confused expressions and no communication, right side shows the same bubbles connecting and interlocking into a smooth moving gear system labeled The Coordinated Team with arrows showing information flowing seamlessly between all members, corporate animation style, clean modern design, 4K cinematic quality",
    musicPrompt: "Steady optimistic and highly rhythmic corporate modern beat, synchronized and efficient feel, well-oiled machine energy, confident collaborative tempo",
    script: "A team without communication protocols is not a team — it is just a group of talented individuals working in parallel and hoping their outputs connect. To transform individual effort into accountable delivery, you need a self-audit. Ask yourself: Do we have a daily stand-up? Does it actually finish in 15 minutes? Do we have a clear policy on where data is shared? Is every decision followed by an email? Protocols aren't meant to slow you down. They are the tracks that allow the train to move at high speed. When everyone knows how we talk, we can focus entirely on what we are building."
  },

  // ── Scene 3: Escalation Without Fear (2:30 – 4:00) ──
  {
    scene: 3,
    title: "Escalation_Without_Fear",
    type: "T2V",
    timeRange: "2:30 - 4:00",
    voice: "Ethan",
    visualPrompt: "A professional timeline drawing appearing on a whiteboard, Day 1 on the left shows many wide Recovery Options arrows spreading out in green with low cost labels, moving right the options narrow dramatically, Day 14 on the right shows only one tiny expensive sliver of an option highlighted in red with high cost multiplied label, text overlay The Silence Cost appearing in bold white, a project manager pointing to the shrinking options with concern, corporate whiteboard presentation style, 4K cinematic quality",
    musicPrompt: "Minimalist and thoughtful single piano instrument creating a reflective introspective mood, quiet and contemplative, weight of silence and missed opportunity, slow deliberate notes",
    script: "In many Indonesian organizations, the most dangerous words in a project are not we have a problem. The most dangerous words are saya tidak enak bilang ke atasan — I feel uneasy telling the boss. That silence is where projects quietly die. Look at this timeline. On Day 1, a problem is small, and we have ten ways to fix it for almost no cost. By Day 14, those options have narrowed to one, and the cost has multiplied. What would that one five-minute conversation on Day 1 have saved? Escalation is not a sign of failure; it is an act of loyalty to the project's success. We must build a culture where speaking up early is rewarded, because the cost of silence is a price no project can afford to pay."
  },

  // ── Scene 4: The Art of the Requirement (4:00 – 5:00) ──
  {
    scene: 4,
    title: "The_Art_of_the_Requirement",
    type: "T2V",
    timeRange: "4:00 - 5:00",
    voice: "Ethan",
    visualPrompt: "Professional split screen showing two contrasting interview styles in a modern office: left side Style A shows a PM asking What features do you want with the client looking confused and disengaged with a question mark over their head, right side Style B shows a PM leaning forward warmly asking Tell me about your workday with the client looking animated engaged and expressive with a lightbulb moment icon appearing, warm professional office lighting, 4K cinematic quality",
    musicPrompt: "Warm lightbulb moment acoustic-electronic hybrid, intelligent and bright feel, discovery and insight tone, curious and optimistic energy, gentle uplifting melody",
    script: "What do you do with a client who doesn't know what they want? A client who cannot articulate requirements is not a difficult client — they are an undiscovered opportunity. The mistake most PMs make is asking: What feature do you want? The client isn't a developer; they don't know the features. Instead, ask: Ceritakan hari kerja Anda dari pagi sampai sore. Tell me about your workday. When you listen to their story, you discover the pain points they didn't even know they had. Your skill isn't just taking orders; it's asking the right questions until clarity emerges from their confusion. You aren't just building a system; you are solving a day in their life."
  },

  // ── Scene 5: Conclusion & Call to Action (5:00 – 5:45) ──
  {
    scene: 5,
    title: "Conclusion_and_Call_to_Action",
    type: "T2V",
    timeRange: "5:00 - 5:45",
    voice: "Ethan",
    visualPrompt: "Uplifting montage of professional success moments in a modern Jakarta office: confident handshakes between PM and clients, clear professional emails appearing on laptop screens with sent confirmation, diverse team members laughing and collaborating together around a table, project dashboard showing all green status, then cinematic fade to a clean dark background with bold inspiring quote appearing word by word: Communication is the Project's Oxygen, warm golden professional lighting, 4K cinematic documentary style",
    musicPrompt: "Inspirational and grand resolution, full orchestral synth crescendo, powerful uplifting finale, sense of professional achievement and team unity, memorable corporate inspirational closing score",
    script: "Communication is the oxygen of your project. Without it, even the best technical plans will suffocate. Document your decisions, coordinate your team, find the courage to escalate early, and learn to listen to the stories behind the requirements. When you master the art of the conversation, you master the art of delivery. Go back to your teams today and send that follow-up email. Have that tidak enak conversation. Start the oxygen flowing. Let's finish strong."
  }

];

// ════════════════════════════════════════════════
// Save music prompts reference
// ════════════════════════════════════════════════
function saveMusicReference() {
  if (!fs.existsSync(IMAGE_FOLDER)) fs.mkdirSync(IMAGE_FOLDER, { recursive: true });
  var refFile = path.join(IMAGE_FOLDER, "music_prompts_reference.txt");
  var content = "PM COMMUNICATION VIDEO — MUSIC PROMPTS REFERENCE\n";
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
  console.log("⚡ PM Communication — Video Generator");
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
  console.log("   1. Update merge-final-video.js paths to pmcommunication folder");
  console.log("   2. Update SCENES titles in merge-final-video.js");
  console.log("   3. Add BGM files to E:\\NB\\Frames\\pmcommunication\\bgm\\");
  console.log("   4. Run merge-final-video.js");
}

main();
