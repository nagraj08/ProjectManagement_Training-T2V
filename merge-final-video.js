// ═══════════════════════════════════════════════
// Risk Management — Final Video Merger
// Per-scene BGM mapping + slow motion sync
// Run: node merge-final-video.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ════════════════════════════════════════════════
// 📂 FOLDER PATHS
// ════════════════════════════════════════════════
/*const VIDEO_FOLDER  = "E:\\NB\\Frames\\riskmanagement\\video";
const AUDIO_FOLDER  = "E:\\NB\\Frames\\riskmanagement\\audio";
const BGM_FOLDER    = "E:\\NB\\Frames\\riskmanagement\\bgm";
const OUTPUT_FOLDER = "E:\\NB\\Frames\\riskmanagement\\final";
const TEMP_FOLDER   = "E:\\NB\\Frames\\riskmanagement\\temp";
const FINAL_OUTPUT  = "E:\\NB\\Frames\\riskmanagement\\final\\RiskManagement_Final_Video.mp4";

const VIDEO_FOLDER = "E:\\NB\\Frames\\burnout\\video";
const AUDIO_FOLDER = "E:\\NB\\Frames\\burnout\\audio";
const BGM_FOLDER   = "E:\\NB\\Frames\\burnout\\bgm";
const OUTPUT_FOLDER = "E:\\NB\\Frames\\burnout\\final";
const TEMP_FOLDER  = "E:\\NB\\Frames\\burnout\\temp";
const FINAL_OUTPUT = "E:\\NB\\Frames\\burnout\\final\\Burnout_Final_Video.mp4";

const VIDEO_FOLDER  = "E:\\NB\\Frames\\qualityassurance\\video";
const AUDIO_FOLDER  = "E:\\NB\\Frames\\qualityassurance\\audio";
const BGM_FOLDER    = "E:\\NB\\Frames\\qualityassurance\\bgm";
const OUTPUT_FOLDER = "E:\\NB\\Frames\\qualityassurance\\final";
const TEMP_FOLDER   = "E:\\NB\\Frames\\qualityassurance\\temp";
const FINAL_OUTPUT  = "E:\\NB\\Frames\\qualityassurance\\final\\QA_Final_Video.mp4";
const VIDEO_FOLDER  = "E:\\NB\\Frames\\definitionofdone\\video";
const AUDIO_FOLDER  = "E:\\NB\\Frames\\definitionofdone\\audio";
const BGM_FOLDER    = "E:\\NB\\Frames\\definitionofdone\\bgm";
const OUTPUT_FOLDER = "E:\\NB\\Frames\\definitionofdone\\final";
const TEMP_FOLDER   = "E:\\NB\\Frames\\definitionofdone\\temp";
const FINAL_OUTPUT  = "E:\\NB\\Frames\\definitionofdone\\final\\DefinitionOfDone_Final_Video.mp4";

const VIDEO_FOLDER  = "E:\\NB\\Frames\\pmleadership\\video";
const AUDIO_FOLDER  = "E:\\NB\\Frames\\pmleadership\\audio";
const BGM_FOLDER    = "E:\\NB\\Frames\\pmleadership\\bgm";
const OUTPUT_FOLDER = "E:\\NB\\Frames\\pmleadership\\final";
const TEMP_FOLDER   = "E:\\NB\\Frames\\pmleadership\\temp";
const FINAL_OUTPUT  = "E:\\NB\\Frames\\pmleadership\\final\\PMLeadership_Final_Video.mp4";
*/
const VIDEO_FOLDER  = "E:\\NB\\Frames\\pmcommunication\\video";
const AUDIO_FOLDER  = "E:\\NB\\Frames\\pmcommunication\\audio";
const BGM_FOLDER    = "E:\\NB\\Frames\\pmcommunication\\bgm";
const OUTPUT_FOLDER = "E:\\NB\\Frames\\pmcommunication\\final";
const TEMP_FOLDER   = "E:\\NB\\Frames\\pmcommunication\\temp";
const FINAL_OUTPUT  = "E:\\NB\\Frames\\pmcommunication\\final\\PMCommunication_Final_Video.mp4";


// ════════════════════════════════════════════════
// 🔊 VOLUME SETTINGS
// ════════════════════════════════════════════════
const VOICEOVER_VOLUME   = 1.0;    // 100% — narrator always clear
const DEFAULT_BGM_VOLUME = 0.06;   // 6%   — default BGM volume

// ════════════════════════════════════════════════
// ⚙️ SYNC SETTINGS
// ════════════════════════════════════════════════
const MAX_SLOWDOWN = 0.25; // 4x max slower

// ════════════════════════════════════════════════
// 🎵 QUICK SWITCH: Use ONE BGM for all scenes
//    Set to true  → uses SINGLE_BGM_FILE for all
//    Set to false → uses per-scene bgm defined below
// ════════════════════════════════════════════════
const USE_SINGLE_BGM_FOR_ALL = false;
const SINGLE_BGM_FILE        = "background_music.mp3";

// ════════════════════════════════════════════════
// 🎬 SCENE DEFINITIONS WITH PER-SCENE BGM
//
// bgm       — MP3 filename inside BGM_FOLDER
//             set to null for no BGM on that scene
// bgmVolume — volume override for this scene
//
// 📥 HOW TO ADD BGM:
//   1. Download MP3 from https://pixabay.com/music
//   2. Rename clearly e.g. scene1_deep_synth.mp3
//   3. Place in E:\NB\Frames\riskmanagement\bgm\
//   4. Set the bgm field below to the filename
// ════════════════════════════════════════════════
/*const SCENES = [
  {
    scene: 1,
    title: "The_Mindset_Shift",
    bgm: "scene1_deep_synth.mp3",        // 🎵 Deep rhythmic synth — anticipation
    bgmVolume: 0.07                       // slightly louder for dramatic opening
  },
  {
    scene: 2,
    title: "The_Architecture_of_Register",
    bgm: "scene2_analytical_pulse.mp3",  // 🎵 Clean steady analytical pulse
    bgmVolume: 0.05                       // quieter — let explanation be clear
  },
  {
    scene: 3,
    title: "The_Matrix_and_Banking_Case",
    bgm: "scene3_data_driven.mp3",       // 🎵 Faster tempo math-heavy feel
    bgmVolume: 0.06
  },
  {
    scene: 4,
    title: "Industry_Specifics",
    bgm: "scene4_corporate_tech.mp3",    // 🎵 Varied textures per industry
    bgmVolume: 0.06
  },
  {
    scene: 5,
    title: "The_Ritual_and_Conclusion",
    bgm: "scene5_inspirational.mp3",     // 🎵 Inspirational cinematic resolution
    bgmVolume: 0.08                       // slightly louder for powerful ending
  }
];

const SCENES = [
  { scene: 1, title: "The_Accountability_Pivot",        bgm: "scene1_bgm.mp3", bgmVolume: 0.06 },
  { scene: 2, title: "The_Cause_Chain",                 bgm: "scene2_bgm.mp3", bgmVolume: 0.06 },
  { scene: 3, title: "The_80_Percent_Rule_and_Board",   bgm: "scene3_bgm.mp3", bgmVolume: 0.05 },
  { scene: 4, title: "The_Retrospective_and_Trigger",   bgm: "scene4_bgm.mp3", bgmVolume: 0.05 },
  { scene: 5, title: "Early_Warning_Signals",           bgm: "scene5_bgm.mp3", bgmVolume: 0.07 }
];
const SCENES = [
  { scene: 1, title: "The_Visceral_Cost_of_Shortcuts",  bgm: "scene1_bgm.mp3", bgmVolume: 0.07 },
  { scene: 2, title: "The_Integrated_Model",            bgm: "scene2_bgm.mp3", bgmVolume: 0.06 },
  { scene: 3, title: "The_Five_Non_Negotiables",        bgm: "scene3_bgm.mp3", bgmVolume: 0.06 },
  { scene: 4, title: "The_Pressure_Response",           bgm: "scene4_bgm.mp3", bgmVolume: 0.05 },
  { scene: 5, title: "Conclusion_and_Summary",          bgm: "scene5_bgm.mp3", bgmVolume: 0.08 }
];
const SCENES = [
  { scene: 1, title: "The_Experiment",                       bgm: "scene1_bgm.mp3", bgmVolume: 0.06 },
  { scene: 2, title: "The_Four_Levels_of_Done",              bgm: "scene2_bgm.mp3", bgmVolume: 0.06 },
  { scene: 3, title: "The_Conflict_Prevention_Case_Study",   bgm: "scene3_bgm.mp3", bgmVolume: 0.06 },
  { scene: 4, title: "Three_Tips_for_Sticking_to_It",        bgm: "scene4_bgm.mp3", bgmVolume: 0.07 },
  { scene: 5, title: "Final_Call_to_Action",                 bgm: "scene5_bgm.mp3", bgmVolume: 0.08 }
];
const SCENES = [
  { scene: 1, title: "Leading_Without_Authority",        bgm: "scene1_bgm.mp3", bgmVolume: 0.07 },
  { scene: 2, title: "Managing_the_Multi_Project_Load",  bgm: "scene2_bgm.mp3", bgmVolume: 0.06 },
  { scene: 3, title: "The_Ownership_Mindset",            bgm: "scene3_bgm.mp3", bgmVolume: 0.06 },
  { scene: 4, title: "Accountability_to_Management",     bgm: "scene4_bgm.mp3", bgmVolume: 0.05 },
  { scene: 5, title: "Final_Reflection_and_Summary",     bgm: "scene5_bgm.mp3", bgmVolume: 0.08 }
];*/
const SCENES = [
  { scene: 1, title: "The_WhatsApp_Trap",              bgm: "scene1_bgm.mp3", bgmVolume: 0.07 },
  { scene: 2, title: "The_Coordinated_Team",           bgm: "scene2_bgm.mp3", bgmVolume: 0.06 },
  { scene: 3, title: "Escalation_Without_Fear",        bgm: "scene3_bgm.mp3", bgmVolume: 0.05 },
  { scene: 4, title: "The_Art_of_the_Requirement",     bgm: "scene4_bgm.mp3", bgmVolume: 0.06 },
  { scene: 5, title: "Conclusion_and_Call_to_Action",  bgm: "scene5_bgm.mp3", bgmVolume: 0.08 }
];
// ════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════
function createFolders() {
  [OUTPUT_FOLDER, TEMP_FOLDER, BGM_FOLDER].forEach(function(f) {
    if (!fs.existsSync(f)) {
      fs.mkdirSync(f, { recursive: true });
      console.log("📁 Created: " + f);
    }
  });
}

function checkFFmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "pipe" });
    console.log("✅ FFmpeg found!");
    return true;
  } catch(e) {
    console.log("❌ FFmpeg not found!");
    console.log("   Run in PowerShell as Admin: winget install ffmpeg");
    return false;
  }
}

function runFFmpeg(cmd, description) {
  console.log("\n⚙️  " + description + "...");
  try {
    execSync("ffmpeg -y " + cmd, { stdio: "pipe" });
    console.log("✅ Done!");
    return true;
  } catch(err) {
    var errMsg = err.stderr ? err.stderr.toString().slice(-800) : err.message;
    console.log("❌ Failed:\n" + errMsg);
    return false;
  }
}

function getDuration(filepath) {
  try {
    var result = execSync(
      'ffprobe -v quiet -show_entries format=duration -of csv=p=0 "' + filepath + '"',
      { stdio: "pipe" }
    ).toString().trim();
    return parseFloat(result);
  } catch(e) { return 10; }
}

// ── Resolve BGM for a scene ──
function resolveBGM(scene) {
  // Single BGM mode
  if (USE_SINGLE_BGM_FOR_ALL) {
    var singlePath = path.join(BGM_FOLDER, SINGLE_BGM_FILE);
    if (fs.existsSync(singlePath)) {
      return { path: singlePath, volume: DEFAULT_BGM_VOLUME };
    }
    console.log("⚠️  Single BGM not found: " + singlePath);
    return null;
  }

  // Per-scene BGM mode
  if (!scene.bgm) {
    console.log("   🔇 No BGM defined for Scene " + scene.scene);
    return null;
  }
  var bgmPath = path.join(BGM_FOLDER, scene.bgm);
  if (!fs.existsSync(bgmPath)) {
    console.log("   ⚠️  BGM not found: " + bgmPath);
    console.log("   📥 Place MP3 at: " + bgmPath);
    return null;
  }
  return { path: bgmPath, volume: scene.bgmVolume || DEFAULT_BGM_VOLUME };
}

// ════════════════════════════════════════════════
// STEP 1: Check all files
// ════════════════════════════════════════════════
function checkFiles() {
  console.log("\n📂 Checking files...\n");
  var missing = [];

  SCENES.forEach(function(s) {
    var v = path.join(VIDEO_FOLDER, "Scene" + s.scene + "_" + s.title + ".mp4");
    var a = path.join(AUDIO_FOLDER, "Scene" + s.scene + "_" + s.title + ".mp3");

    if (!fs.existsSync(v)) missing.push("VIDEO: Scene" + s.scene + "_" + s.title + ".mp4");
    else console.log("✅ Video " + s.scene + " (" + getDuration(v).toFixed(1) + "s): " + s.title.replace(/_/g, " "));

    if (!fs.existsSync(a)) missing.push("AUDIO: Scene" + s.scene + "_" + s.title + ".mp3");
    else console.log("✅ Audio " + s.scene + " (" + getDuration(a).toFixed(1) + "s): " + s.title.replace(/_/g, " "));

    var bgm = resolveBGM(s);
    console.log("🎵 BGM   " + s.scene + ": " + (bgm ? path.basename(bgm.path) + " (" + (bgm.volume*100).toFixed(0) + "%)" : "No BGM") + "\n");
  });

  if (missing.length > 0) {
    console.log("❌ Missing files:");
    missing.forEach(function(m) { console.log("   " + m); });
    console.log("\n   Run generate-character-scenes.js first!");
    return false;
  }
  return true;
}

// ════════════════════════════════════════════════
// STEP 2: Merge each scene — video + voice + BGM
// ════════════════════════════════════════════════
function mergeSceneAudioVideo(scene) {
  var videoFile = path.join(VIDEO_FOLDER, "Scene" + scene.scene + "_" + scene.title + ".mp4");
  var audioFile = path.join(AUDIO_FOLDER, "Scene" + scene.scene + "_" + scene.title + ".mp3");
  var outFile   = path.join(TEMP_FOLDER,  "scene" + scene.scene + "_merged.mp4");

  var videoDur  = getDuration(videoFile);
  var audioDur  = getDuration(audioFile);
  var targetDur = Math.max(videoDur, audioDur);
  var bgm       = resolveBGM(scene);

  console.log("   🎬 Video : " + videoDur.toFixed(2) + "s");
  console.log("   🎙️  Audio : " + audioDur.toFixed(2) + "s");
  console.log("   🎵 BGM   : " + (bgm ? path.basename(bgm.path) + " at " + (bgm.volume*100).toFixed(0) + "%" : "None"));

  var videoFilter;
  var videoInput = "-i \"" + videoFile + "\" ";

  if (audioDur <= videoDur) {
    // Audio shorter — copy video as-is
    console.log("   📌 Sync  : Padding silence (audio shorter)");
    videoFilter = "[0:v]copy[vout]";

  } else {
    var slowFactor = audioDur / videoDur;

    if (slowFactor <= (1 / MAX_SLOWDOWN)) {
      // Slow motion
      console.log("   🐌 Sync  : Slow motion " + slowFactor.toFixed(2) + "x");
      videoFilter = "[0:v]minterpolate=fps=30:mi_mode=mci,setpts=" + slowFactor.toFixed(4) + "*PTS[vout]";

    } else {
      // Loop + slow
      var loops = Math.ceil(audioDur / videoDur);
      var loopSlowFactor = Math.max(audioDur / (videoDur * loops), 0.5);
      console.log("   🔁 Sync  : Loop " + loops + "x + slow " + loopSlowFactor.toFixed(2) + "x");
      videoInput = "-stream_loop " + loops + " -i \"" + videoFile + "\" ";
      videoFilter = "[0:v]setpts=" + loopSlowFactor.toFixed(4) + "*PTS[vout]";
    }
  }

  var cmd;

  if (bgm) {
    // Three-way mix: video + voiceover + per-scene BGM
    cmd = videoInput +
          "-i \"" + audioFile + "\" " +
          "-stream_loop -1 -i \"" + bgm.path + "\" " +
          "-filter_complex " +
          "\"" + videoFilter + ";" +
          "[1:a]apad=whole_dur=" + targetDur + ",volume=" + VOICEOVER_VOLUME + "[voice];" +
          "[2:a]volume=" + bgm.volume + ",atrim=0:" + targetDur + "[bgm];" +
          "[voice][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]\" " +
          "-map \"[vout]\" -map \"[aout]\" " +
          "-c:v libx264 -c:a aac " +
          "-t " + targetDur + " " +
          "-pix_fmt yuv420p " +
          "\"" + outFile + "\"";
  } else {
    // Two-way: video + voiceover only
    cmd = videoInput +
          "-i \"" + audioFile + "\" " +
          "-filter_complex " +
          "\"" + videoFilter + ";" +
          "[1:a]apad=whole_dur=" + targetDur + ",volume=" + VOICEOVER_VOLUME + "[aout]\" " +
          "-map \"[vout]\" -map \"[aout]\" " +
          "-c:v libx264 -c:a aac " +
          "-t " + targetDur + " " +
          "-pix_fmt yuv420p " +
          "\"" + outFile + "\"";
  }

  return runFFmpeg(cmd, "Scene " + scene.scene + " [" + scene.title.replace(/_/g, " ") + "]");
}

// ════════════════════════════════════════════════
// STEP 3: Concat all scenes
// ════════════════════════════════════════════════
function createConcatList() {
  var listFile = path.join(TEMP_FOLDER, "concat_list.txt");
  var lines = SCENES.map(function(s) {
    return "file '" + path.join(TEMP_FOLDER, "scene" + s.scene + "_merged.mp4").replace(/\\/g, "/") + "'";
  }).join("\n");
  fs.writeFileSync(listFile, lines + "\n");
  console.log("✅ Scene list created");
  return listFile;
}

function concatenateScenes(listFile) {
  var concatFile = path.join(TEMP_FOLDER, "all_scenes.mp4");
  var cmd = "-f concat -safe 0 " +
            "-i \"" + listFile + "\" " +
            "-c:v libx264 -c:a aac -pix_fmt yuv420p " +
            "\"" + concatFile + "\"";
  return runFFmpeg(cmd, "Joining all " + SCENES.length + " scenes") ? concatFile : null;
}

// ════════════════════════════════════════════════
// STEP 4: Export final
// ════════════════════════════════════════════════
function exportFinal(concatFile) {
  return runFFmpeg(
    "-i \"" + concatFile + "\" -c copy \"" + FINAL_OUTPUT + "\"",
    "Exporting final video"
  );
}

// ════════════════════════════════════════════════
// CLEANUP
// ════════════════════════════════════════════════
function cleanup() {
  console.log("\n🧹 Cleaning temp files...");
  try {
    SCENES.forEach(function(s) {
      var f = path.join(TEMP_FOLDER, "scene" + s.scene + "_merged.mp4");
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });
    ["concat_list.txt", "all_scenes.mp4"].forEach(function(f) {
      var fp = path.join(TEMP_FOLDER, f);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    });
    console.log("✅ Done");
  } catch(e) { console.log("⚠️  " + e.message); }
}

// ════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════
async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("⚡ Risk Management — Final Video Merger");
  console.log("   BGM mode  : " + (USE_SINGLE_BGM_FOR_ALL ? "Single BGM for all" : "Per-scene BGM"));
  console.log("   Narrator  : " + (VOICEOVER_VOLUME*100) + "%");
  console.log("   BGM       : " + (DEFAULT_BGM_VOLUME*100) + "% default");
  console.log("   Video SFX : 0% (muted)");
  console.log("   Sync      : SlowMo (≤4x) → Loop+Slow (>4x)");
  console.log("═══════════════════════════════════════════");

  if (!checkFFmpeg()) return;
  createFolders();
  if (!checkFiles()) return;

  console.log("\n🎬 STEP 1: Merging each scene (video + voice + BGM)...");
  for (var i = 0; i < SCENES.length; i++) {
    console.log("\n── Scene " + SCENES[i].scene + "/" + SCENES.length + ": " + SCENES[i].title.replace(/_/g, " ") + " ──");
    if (!mergeSceneAudioVideo(SCENES[i])) {
      console.log("❌ Failed at Scene " + SCENES[i].scene);
      return;
    }
  }

  console.log("\n📋 STEP 2: Building scene list...");
  var listFile = createConcatList();

  console.log("\n🔗 STEP 3: Joining all scenes...");
  var concatFile = concatenateScenes(listFile);
  if (!concatFile) { console.log("❌ Concat failed."); return; }

  console.log("\n📤 STEP 4: Exporting final video...");
  exportFinal(concatFile);

  if (fs.existsSync(FINAL_OUTPUT)) {
    var size = (fs.statSync(FINAL_OUTPUT).size / 1024 / 1024).toFixed(2);
    var dur  = getDuration(FINAL_OUTPUT);
    console.log("\n═══════════════════════════════════════════");
    console.log("🎉 FINAL VIDEO READY!");
    console.log("   📁 " + FINAL_OUTPUT);
    console.log("   📦 Size     : " + size + " MB");
    console.log("   ⏱️  Duration : " + dur.toFixed(1) + "s (~" + (dur/60).toFixed(1) + " mins)");
    console.log("═══════════════════════════════════════════");
    console.log("🏆 Your video is ready to submit!");
  } else {
    console.log("❌ Output not created. Check errors above.");
  }

  cleanup();
}

main();
