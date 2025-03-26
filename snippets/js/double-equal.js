// Beides "true"
console.log(0 == "")
console.log(0 == "0");

// Aufgrund der Transitvität müsste also
// auch folgendes "true" sein?
console.log("" == "0");

// Gibt alles "true" zurück
console.log([0] == false);
console.log([1] == true);
console.log('\r\n\t' == 0);
