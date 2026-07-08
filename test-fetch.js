const res = await fetch("https://slelguoygbfzlpylpxfs.supabase.co/rest/v1/history?select=*", {
  headers: {
    "apikey": " "
  }
});
const data = await res.text();
console.log(data);
