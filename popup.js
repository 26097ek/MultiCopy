document.getElementById('clickMe').addEventListener('click', () => {
  alert('You clicked the button!');
});

document.addEventListener("keydown", (e) => {
  document.querySelector("#key").innerHTML = "e.code = " + e.code + " and e.key = " + e.key;
});
async function readItems() {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  const sliceIt = (string) => 
    [...segmenter.segment(string)].slice(0, 100).map(s => s.segment).join('');
  const getLength = (string) =>
    [...segmenter.segment(string)].length;
  for (let i=1; i<=4; i++){
    const {[`S${i}`]:val} = await chrome.storage.session.get(`S${i}`);
    const cutVal = getLength(val)<100?val:(sliceIt(val)+"...")
    document.querySelector(`#s${i}`).textContent = `Slot ${i} = ${cutVal}`
  };
};
readItems();