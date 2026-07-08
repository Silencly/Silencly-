const res = await fetch("https://api.assemblyai.com/v2/transcript", {
  method: "POST"
});
const data = await res.text();
console.log(data);
