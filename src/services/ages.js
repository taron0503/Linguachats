function generte_ages(){
	let ages = []
	for (var i = 5; i <= 100; i++) {
		ages.push({"value":i+"","label":i+""})
	}
	return ages
}

let ages = generte_ages()

export default ages