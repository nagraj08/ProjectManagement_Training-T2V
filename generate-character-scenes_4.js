// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Definition of Done Video Generator
// 5 Scenes â€” Project Management Series
// Run: node generate-character-scenes_4.js
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const fs = require("fs");
const path = require("path");

const API_KEY = "Use_YourAPI_Key_Here";

const T2V_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis";
const TTS_URL  = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const TASK_URL = "https://dashscope-intl.aliyuncs.com/api/v1/tasks/";

const AUDIO_FOLDER = "E:\\NB\\Frames\\definitionofdone\\audio";
const VIDEO_FOLDER = "E:\\NB\\Frames\\definitionofdone\\video";
const IMAGE_FOLDER = "E:\\NB\\Frames\\definitionofdone\\image";

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ðŸŽ¬ SCENE DEFINITIONS â€” Definition of Done Series
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const SCENES = [

  // â”€â”€ Scene 1: The Experiment (0:00 â€“ 1:10) â”€â”€
  {
    scene: 1,
    title: "The_Experiment",
    type: "T2V",
    timeRange: "0:00 - 1:10",
    voice: "Ethan",
    visualPrompt: "Close-up cinematic shots of three different team members â€” a Developer, a QA Engineer, and a Client â€” each nodding confidently while saying It is done, then dramatic pull-back camera movement revealing all three are looking at completely different broken parts of the same complex machine, visual metaphor of misalignment, text overlay reading The Definition Problem in bold white font, dark mysterious atmosphere, 4K cinematic documentary style",
    musicPrompt: "Low mysterious ambient pad with a light percussive clack sound like a typewriter, subtle tension building, enigmatic and thought-provoking feel, soft rhythmic tapping",
    script: "I want to run a quick experiment. Everyone, think of a task on your current project that you would describe as almost done. Now ask yourself: what exactly needs to happen before it is completely done? Is it just code complete? Is it unit tested? Has a peer reviewed it? Is the documentation updated? If different people on your team have different answers â€” and they almost certainly do â€” you don't have a quality problem. You have a definition problem. Without a Definition of Done, finished means something different to your developer, your QA, and your client. That four-way misalignment is exactly where final-week project crises are born and relationship trust dies."
  },

  // â”€â”€ Scene 2: The Four Levels of Done (1:10 â€“ 2:40) â”€â”€
  {
    scene: 2,
    title: "The_Four_Levels_of_Done",
    type: "T2V",
    timeRange: "1:10 - 2:40",
    voice: "Ethan",
    visualPrompt: "Cinematic 8K quality graphic of a professional staircase with four clearly labeled steps rising from bottom to top: Step 1 Developer Done, Step 2 QA Done, Step 3 Sprint Done, Step 4 Project Done, each step glowing and expanding as narrator mentions it, green checkmarks appearing rapidly next to detailed checklist items on each step, clean dark professional presentation background, upward motion camera slowly rising with the staircase, 4K corporate visualization",
    musicPrompt: "Upbeat methodical and rhythmic progressing in complexity, each level adds a new musical layer building from simple to full orchestration, structured and confident corporate tempo",
    script: "A professional project defines Done at four distinct levels. Level 1 is Developer Done. It's not just writing code; it's passing 80 percent unit test coverage, a peer review, and updated technical docs. Level 2 is QA Done. This means all S1 and S2 bugs are resolved, performance benchmarks are met, and the evidence is stored. Level 3 is Sprint Done. We've demoed to the client, logged their feedback, and finished our retrospective. And finally, Level 4: Project Done. This is the level most projects fail to complete. It includes the security audit, user training records, and most importantly the formal lessons learned. Most projects in Indonesia stop at go-live. But the projects that actually improve are the ones that finish the final two items: documentation and formal closure."
  },

  // â”€â”€ Scene 3: The Conflict Prevention Case Study (2:40 â€“ 4:00) â”€â”€
  {
    scene: 3,
    title: "The_Conflict_Prevention_Case_Study",
    type: "T2V",
    timeRange: "2:40 - 4:00",
    voice: "Ethan",
    visualPrompt: "Split-screen professional animation: left side has bold red header The Chaos Path showing project weeks 10 through 13 crumbling with red warning indicators, error messages, angry client icons, and cascading failures, right side has bold green header The Definition Path showing smooth predictable weekly flow with green checkmarks, satisfied stakeholder icons, and orderly progression, both sides animated simultaneously showing stark contrast, corporate project management visualization style, 4K cinematic",
    musicPrompt: "Two-tone contrasting music: left chaos side plays dissonant chaotic strings with urgent alarm undertones, right definition side plays harmonious steady organized rhythm, the two sides contrast clearly before harmonious side takes over",
    script: "Let's look at the cost of ambiguity. Without a Definition of Done, by Week 10, the developer says the payment module is finished. But in Week 11, QA finds bugs the developer already knew about. By Week 12, the client finds business failures QA never tested for. Everyone was technically telling the truth from their own perspective, but the conflict cost you three weeks and a damaged relationship. Now, look at the alternative. With a shared definition, the peer review happens before it leaves development. QA tests against agreed cases before UAT. The outcome is completely different. Same team, same project â€” but a shared definition changes the world."
  },

  // â”€â”€ Scene 4: Three Tips for Sticking to It (4:00 â€“ 5:00) â”€â”€
  {
    scene: 4,
    title: "Three_Tips_for_Sticking_to_It",
    type: "T2V",
    timeRange: "4:00 - 5:00",
    voice: "Ethan",
    visualPrompt: "Three professional icons appearing one by one on screen: first a bold Poster icon showing definition printed and visible on office wall, second a Megaphone icon representing sprint planning announcement with team listening attentively, third a Shield icon showing a confident project manager standing firm and protecting the standard against pressure, each icon expanding with supporting text as narrator speaks, clean modern corporate infographic style, dark background with orange and white accent colors, 4K quality",
    musicPrompt: "Powerful driving and encouraging beat, building momentum with each tip, energetic and motivating corporate rhythm, confident and assertive tone throughout",
    script: "How do you make this stick? First: Print it and post it. If the definition lives in a document nobody opens, it doesn't exist. Visibility creates adherence. Second: Review it at the start, not the end. Read it aloud during sprint planning. It takes 90 seconds, but it aligns the team before the first line of code is written. And third: Never negotiate it under pressure. The moment you say For this sprint, let's consider it done if and reduce the standard, the definition becomes a suggestion. And suggestions produce inconsistent quality. Standards are only standards if they are non-negotiable."
  },

  // â”€â”€ Scene 5: Final Call to Action (5:00 â€“ 5:45) â”€â”€
  {
    scene: 5,
    title: "Final_Call_to_Action",
    type: "T2V",
    timeRange: "5:00 - 5:45",
    voice: "Ethan",
    visualPrompt: "Cinematic shots of a calm and successful project delivery: team members shaking hands confidently, clean deployment dashboards showing all green status, project manager signing off final documentation with satisfied smile, client receiving the product with approval, warm professional office lighting, then slow cinematic fade to pure black screen with bold white text appearing word by word: The Definition of Done is your team contract for excellence, grand resolute closing shot, 4K documentary style",
    musicPrompt: "Grand triumphant and resolute orchestral finish, full cinematic crescendo, sense of professional achievement and excellence, powerful inspiring finale, memorable closing score",
    script: "Quality Assurance is the difference between a project that survives and a project that thrives. By weaving QA into every phase, respecting our environments, and standing firm on our non-negotiables, we protect our team, our clients, and our reputation. Let us make quality our baseline, not our afterthought. Your next project starts with a test plan — not a prayer."
  }

];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Save music prompts reference
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function saveMusicReference() {
  if (!fs.existsSync(IMAGE_FOLDER)) fs.mkdirSync(IMAGE_FOLDER, { recursive: true });
  var refFile = path.join(IMAGE_FOLDER, "music_prompts_reference.txt");
  var content = "DEFINITION OF DONE VIDEO â€” MUSIC PROMPTS REFERENCE\n";
  content += "Use these prompts on Suno.ai or Udio.com\n";
  content += "â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n\n";
  SCENES.forEach(function(s) {
    content += "Scene " + s.scene + " [" + s.timeRange + "]: " + s.title.replace(/_/g, " ") + "\n";
    content += "BGM Prompt : " + s.musicPrompt + "\n";
    content += "BGM File   : scene" + s.scene + "_bgm.mp3\n\n";
  });
  fs.writeFileSync(refFile, content);
  console.log("ðŸŽµ Music reference saved: " + refFile);
}

function wait(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

function createFolders() {
  [AUDIO_FOLDER, VIDEO_FOLDER, IMAGE_FOLDER].forEach(function(folder) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log("ðŸ“ Created: " + folder);
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

// â”€â”€ Generate Audio â”€â”€
async function generateAudio(scene) {
  console.log("ðŸŽ™ï¸  Generating audio... Voice: " + scene.voice);
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
      if (data.code === "Throttling.RateQuota") { console.log("âš ï¸  Rate limit. Waiting 20s..."); await wait(20000); continue; }

      var audioData = null;
      var audioUrl  = null;
      if (data.output && data.output.audio && data.output.audio.data) audioData = data.output.audio.data;
      else if (data.output && data.output.audio && data.output.audio.url) audioUrl = data.output.audio.url;
      else if (data.output && data.output.choices) {
        var content = data.output.choices[0].message.content;
        for (var i = 0; i < content.length; i++) { if (content[i].audio) { audioData = content[i].audio; break; } }
      } else { console.log("âŒ No audio: " + JSON.stringify(data).substring(0, 200)); return null; }

      var buffer;
      if (audioData) buffer = Buffer.from(audioData, "base64");
      else if (audioUrl) { const ar = await fetch(audioUrl); buffer = Buffer.from(await ar.arrayBuffer()); }

      var filename = "Scene" + scene.scene + "_" + scene.title + ".mp3";
      var filepath = path.join(AUDIO_FOLDER, filename);
      fs.writeFileSync(filepath, buffer);
      var duration = getMp3Duration(buffer);
      console.log("âœ… Audio saved: " + filename + " (~" + duration + "s)");
      return { filepath: filepath, duration: duration };

    } catch(err) { console.log("âŒ Error: " + err.message); if (attempt < retries) await wait(10000); }
  }
  return null;
}

// â”€â”€ Submit Video Task â”€â”€
async function submitVideoTask(scene) {
  console.log("ðŸŽ¬ Submitting T2V video (wan2.6-t2v 1080P)...");
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
      if (data.code === "Throttling.RateQuota") { console.log("âš ï¸  Rate limit. Waiting 20s..."); await wait(20000); continue; }
      if (data.output && data.output.task_id) { console.log("âœ… Submitted! Task: " + data.output.task_id); return data.output.task_id; }
      console.log("âŒ Submit failed: " + JSON.stringify(data).substring(0, 200));
      if (attempt < retries) await wait(10000);
    } catch(err) { console.log("âŒ Error: " + err.message); if (attempt < retries) await wait(10000); }
  }
  return null;
}

// â”€â”€ Wait and Download Video â”€â”€
async function waitAndDownloadVideo(task_id, scene) {
  console.log("â³ Waiting for video...");
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
        console.log("â¬‡ï¸  Downloading...");
        const vr = await fetch(videoUrl);
        const buffer = await vr.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        console.log("âœ… Saved: " + filename + " (" + (buffer.byteLength/1024/1024).toFixed(2) + " MB)");
        return filepath;
      }
      if (status === "FAILED") { console.log("âŒ Video failed!"); return null; }
    } catch(err) { console.log("   Poll error: " + err.message); }
  }
  return null;
}

// â”€â”€ Process one full scene â”€â”€
async function processScene(scene) {
  console.log("\nâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");
  console.log("ðŸŽ¬ SCENE " + scene.scene + "/" + SCENES.length + ": " + scene.title.replace(/_/g, " "));
  console.log("   â° Time    : " + scene.timeRange);
  console.log("   ðŸŽµ Music  : " + scene.musicPrompt.substring(0, 70) + "...");
  console.log("   ðŸ“ Script : " + scene.script.length + " characters");
  console.log("â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");

  var audioResult = await generateAudio(scene);
  if (!audioResult) return { scene: scene.scene, title: scene.title, status: "AUDIO_FAILED" };

  var task_id = await submitVideoTask(scene);
  if (!task_id) return { scene: scene.scene, title: scene.title, status: "VIDEO_FAILED", audioPath: audioResult.filepath };

  var videoPath = await waitAndDownloadVideo(task_id, scene);

  if (videoPath) {
    console.log("\nâœ… Scene " + scene.scene + " COMPLETE!");
    console.log("   ðŸŽ™ï¸  Audio : " + audioResult.filepath);
    console.log("   ðŸŽ¬ Video : " + videoPath);
    console.log("   â±ï¸  Duration: ~" + audioResult.duration + "s");
  }

  if (scene.scene < SCENES.length) { console.log("\nâ³ Waiting 5s before next scene..."); await wait(5000); }

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

// â”€â”€ Main â”€â”€
async function main() {
  console.log("â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");
  console.log("âš¡ Definition of Done â€” Video Generator");
  console.log("   Total scenes  : " + SCENES.length);
  console.log("   Total duration: ~5:45 minutes");
  console.log("   Video model   : wan2.6-t2v (1080P)");
  console.log("   Audio model   : qwen3-tts-flash");
  console.log("   Voice         : Ethan (professional male)");
  console.log("â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");

  createFolders();
  saveMusicReference();

  var results = [];
  for (var i = 0; i < SCENES.length; i++) {
    var result = await processScene(SCENES[i]);
    results.push(result);
  }

  console.log("\nâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");
  console.log("ðŸŽ¬ ALL SCENES COMPLETE â€” Summary:");
  console.log("â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•");
  var successCount = 0;
  var totalDuration = 0;
  results.forEach(function(r) {
    if (r.status === "DONE") {
      successCount++;
      totalDuration += r.duration || 0;
      console.log("âœ… [" + r.timeRange + "] Scene " + r.scene + ": " + r.title.replace(/_/g, " "));
      console.log("   ðŸŽ™ï¸  " + r.audioPath);
      console.log("   ðŸŽ¬ " + r.videoPath);
    } else {
      console.log("âŒ Scene " + r.scene + ": " + r.title.replace(/_/g, " ") + " â€” " + r.status);
    }
  });

  console.log("\nðŸŽ‰ " + successCount + "/" + SCENES.length + " scenes ready!");
  console.log("â±ï¸  Total audio: ~" + totalDuration + "s (~" + Math.round(totalDuration/60) + " mins)");
  console.log("\nðŸ“‚ Audio : " + AUDIO_FOLDER);
  console.log("ðŸ“‚ Video : " + VIDEO_FOLDER);
  console.log("ðŸŽµ Music : " + IMAGE_FOLDER + "\\music_prompts_reference.txt");
  console.log("\nðŸ“½ï¸  Next steps:");
  console.log("   1. Update merge-final-video.js paths to definitionofdone folder");
  console.log("   2. Add BGM files to E:\\NB\\Frames\\definitionofdone\\bgm\\");
  console.log("   3. Run merge-final-video.js");
}

main();

