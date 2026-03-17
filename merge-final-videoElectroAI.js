// ═══════════════════════════════════════════════
// ElectroAI — Final Video Merger
// Fix: Slow down video to match audio duration
// Cinematic slow motion — no looping, no padding
// Run: node merge-final-video.js
// ═══════════════════════════════════════════════

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const VIDEO_FOLDER  = "E:\\NB\\Frames\\character\\video";
const AUDIO_FOLDER  = "E:\\NB\\Frames\\character\\audio";
const OUTPUT_FOLDER = "E:\\NB\\Frames\\final";
const TEMP_FOLDER   = "E:\\NB\\Frames\\temp";
const FINAL_OUTPUT  = "E:\\NB\\Frames\\final\\ElectroAI_Final_Video.mp4";
const BGM_FILE      = "E:\\NB\\Frames\\bgm\\kontraa-no-sleep-hiphop-music-473847.mp3";

const VOICEOVER_VOLUME = 1.0;
const BGM_VOLUME       = 0.08;

// ── Slow motion limits ──
// Max slowdown = 0.25 (4x slower) — below this looks unnatural
// If audio is WAY longer, we loop video instead
const MAX_SLOWDOWN = 0.25;

const SCENES = [
  { scene: 1, title: "Worried_Customer" },
  { scene: 2, title: "Lost_Package_Warehouse" },
  { scene: 3, title: "Opens_ElectroAI_Chatbot" },
  { scene: 4, title: "TechBot_Finds_Order" },
  { scene: 5, title: "Package_Arrives" },
  { scene: 6, title: "ElectroAI_Logo_Closing" }
];

function createFolders() {
  [OUTPUT_FOLDER, TEMP_FOLDER, path.dirname(BGM_FILE)].forEach(function(f) {
    if (!fs.existsSync(f)) { fs.mkdirSync(f, { recursive: true }); console.log("📁 Created: " + f); }
  });
}

function checkFFmpeg() {
  try { execSync("ffmpeg -version", { stdio: "pipe" }); console.log("✅ FFmpeg found!"); return true; }
  catch(e) { console.log("❌ FFmpeg not found! Run: winget install ffmpeg"); return false; }
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

function checkFiles() {
  console.log("\n📂 Checking files...");
  var missing = [];
  SCENES.forEach(function(s) {
    var v = path.join(VIDEO_FOLDER, "Scene" + s.scene + "_" + s.title + ".mp4");
    var a = path.join(AUDIO_FOLDER, "Scene" + s.scene + "_" + s.title + ".mp3");
    if (!fs.existsSync(v)) missing.push("VIDEO missing: Scene" + s.scene);
    else console.log("✅ Video " + s.scene + ": " + getDuration(v).toFixed(2) + "s");
    if (!fs.existsSync(a)) missing.push("AUDIO missing: Scene" + s.scene);
    else console.log("✅ Audio " + s.scene + ": " + getDuration(a).toFixed(2) + "s");
  });
  if (missing.length > 0) { missing.forEach(function(m) { console.log("❌ " + m); }); return false; }
  console.log(fs.existsSync(BGM_FILE) ? "✅ BGM: Found" : "⚠️  BGM: Not found — skipping");
  return fs.existsSync(BGM_FILE) ? "with-bgm" : "no-bgm";
}

// ══════════════════════════════════════════════
// KEY FIX: Slow down video to match audio
// setpts = PTS * slowFactor  (e.g. 1.5 = 50% slower)
// fps filter keeps smooth playback during slowdown
// ══════════════════════════════════════════════
function mergeSceneAudioVideo(scene) {
  var videoFile = path.join(VIDEO_FOLDER, "Scene" + scene.scene + "_" + scene.title + ".mp4");
  var audioFile = path.join(AUDIO_FOLDER, "Scene" + scene.scene + "_" + scene.title + ".mp3");
  var outFile   = path.join(TEMP_FOLDER,  "scene" + scene.scene + "_merged.mp4");

  var videoDur = getDuration(videoFile);
  var audioDur = getDuration(audioFile);

  console.log("\n   🎬 Video: " + videoDur.toFixed(2) + "s | 🎙️  Audio: " + audioDur.toFixed(2) + "s");

  var cmd;

  if (audioDur <= videoDur) {
    // Audio is shorter or equal — no slowdown needed
    // Just pad audio with silence to match video
    console.log("   ✅ Audio shorter than video — padding silence");
    cmd = "-i \"" + videoFile + "\" " +
          "-i \"" + audioFile + "\" " +
          "-filter_complex \"[1:a]apad=whole_dur=" + videoDur + "[aout]\" " +
          "-map 0:v -map \"[aout]\" " +
          "-c:v copy -c:a aac " +
          "-t " + videoDur + " " +
          "\"" + outFile + "\"";

  } else {
    // Audio is longer — slow down video to match
    var slowFactor = audioDur / videoDur;

    if (slowFactor <= (1 / MAX_SLOWDOWN)) {
      // Within acceptable slowdown range — use slow motion
      console.log("   🐌 Slowing video by " + slowFactor.toFixed(2) + "x to match audio (" + audioDur.toFixed(2) + "s)");
      // setpts slows video: multiply PTS by slowFactor
      // minterpolate creates smooth frames during slowdown
      cmd = "-i \"" + videoFile + "\" " +
            "-i \"" + audioFile + "\" " +
            "-filter_complex " +
            "\"[0:v]minterpolate=fps=30:mi_mode=mci,setpts=" + slowFactor.toFixed(4) + "*PTS[vout];" +
            "[1:a]volume=" + VOICEOVER_VOLUME + "[aout]\" " +
            "-map \"[vout]\" " +
            "-map \"[aout]\" " +
            "-c:v libx264 " +
            "-c:a aac " +
            "-t " + audioDur + " " +
            "-pix_fmt yuv420p " +
            "\"" + outFile + "\"";
    } else {
      // Audio is WAY too long — loop video + slow slightly
      console.log("   🔁 Audio very long (" + audioDur.toFixed(1) + "s) — looping + slowing video");
      var loops = Math.ceil(audioDur / videoDur);
      var loopSlowFactor = Math.max(audioDur / (videoDur * loops), 0.5);
      cmd = "-stream_loop " + loops + " -i \"" + videoFile + "\" " +
            "-i \"" + audioFile + "\" " +
            "-filter_complex " +
            "\"[0:v]setpts=" + loopSlowFactor.toFixed(4) + "*PTS[vout];" +
            "[1:a]volume=" + VOICEOVER_VOLUME + "[aout]\" " +
            "-map \"[vout]\" " +
            "-map \"[aout]\" " +
            "-c:v libx264 " +
            "-c:a aac " +
            "-t " + audioDur + " " +
            "-pix_fmt yuv420p " +
            "\"" + outFile + "\"";
    }
  }

  return runFFmpeg(cmd, "Scene " + scene.scene + " — Syncing video to audio");
}

function createConcatList() {
  var listFile = path.join(TEMP_FOLDER, "concat_list.txt");
  var lines = SCENES.map(function(s) {
    return "file '" + path.join(TEMP_FOLDER, "scene" + s.scene + "_merged.mp4").replace(/\\/g, "/") + "'";
  }).join("\n");
  fs.writeFileSync(listFile, lines + "\n");
  console.log("✅ Concat list created");
  return listFile;
}

function concatenateScenes(listFile) {
  var concatFile = path.join(TEMP_FOLDER, "all_scenes.mp4");
  var cmd = "-f concat -safe 0 " +
            "-i \"" + listFile + "\" " +
            "-c:v libx264 -c:a aac -pix_fmt yuv420p " +
            "\"" + concatFile + "\"";
  return runFFmpeg(cmd, "Joining all 6 scenes") ? concatFile : null;
}

function addBGM(concatFile) {
  var totalDur = getDuration(concatFile);
  console.log("\n⏱️  Total duration: " + totalDur.toFixed(1) + "s");
  var cmd = "-i \"" + concatFile + "\" " +
            "-stream_loop -1 -i \"" + BGM_FILE + "\" " +
            "-filter_complex " +
            "\"[0:a]volume=" + VOICEOVER_VOLUME + "[voice];" +
            "[1:a]volume=" + BGM_VOLUME + ",atrim=0:" + totalDur + "[bgm];" +
            "[voice][bgm]amix=inputs=2:duration=first:dropout_transition=3[aout]\" " +
            "-map 0:v -map \"[aout]\" " +
            "-c:v copy -c:a aac " +
            "-t " + totalDur + " " +
            "\"" + FINAL_OUTPUT + "\"";
  return runFFmpeg(cmd, "Adding BGM at " + (BGM_VOLUME*100) + "% + exporting");
}

function exportNoBGM(concatFile) {
  return runFFmpeg("-i \"" + concatFile + "\" -c copy \"" + FINAL_OUTPUT + "\"", "Exporting final video");
}

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

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("⚡ ElectroAI — Final Video Merger");
  console.log("   Technique : Slow motion sync");
  console.log("   Voiceover : " + (VOICEOVER_VOLUME*100) + "%");
  console.log("   BGM       : " + (BGM_VOLUME*100) + "%");
  console.log("   Max slow  : " + (1/MAX_SLOWDOWN) + "x slower");
  console.log("═══════════════════════════════════════════");

  if (!checkFFmpeg()) return;
  createFolders();

  var status = checkFiles();
  if (!status) { console.log("❌ Missing files."); return; }

  console.log("\n🎬 STEP 1: Syncing each scene (slow motion)...");
  for (var i = 0; i < SCENES.length; i++) {
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

  if (status === "with-bgm") {
    console.log("\n🎵 STEP 4: Adding background music...");
    if (!addBGM(concatFile)) { exportNoBGM(concatFile); }
  } else {
    console.log("\n📤 STEP 4: Exporting...");
    exportNoBGM(concatFile);
  }

  if (fs.existsSync(FINAL_OUTPUT)) {
    var size = (fs.statSync(FINAL_OUTPUT).size / 1024 / 1024).toFixed(2);
    var dur  = getDuration(FINAL_OUTPUT);
    console.log("\n═══════════════════════════════════════════");
    console.log("🎉 FINAL VIDEO READY!");
    console.log("   📁 " + FINAL_OUTPUT);
    console.log("   📦 Size     : " + size + " MB");
    console.log("   ⏱️  Duration : " + dur.toFixed(1) + "s");
    console.log("═══════════════════════════════════════════");
    console.log("🏆 Submit this for the competition!");
  } else {
    console.log("❌ Output not created. Check errors above.");
  }

  cleanup();
}

main();
