function spacify(str) {
  return str.split('+').join(" ")
}
function deparam(s) {
  let searchArr = s.slice(1).split('&')
  let name = spacify(searchArr[0].split('=')[1])
  let room = spacify(searchArr[1].split('=')[1])
  return {name, room}
}
