import emoji_colection1 from "./img/emojisprite_0.png"

function get_emojies(size=20){
	let emojies=[]
		let emoji;
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 27; j++) {
				emoji = {
				name:"emoji"+i+j,
				url:`url(${emoji_colection1})`,
				backgroundSize:27*size+"px "+7*size+"px",
				top:-(i*size)+"px",
				left:-(j*size)+"px",
			}	
			emojies.push(emoji)
			}
		}
		return emojies;
}

export function get_emoji_byName(name,size=20){
	let emojies = get_emojies(size);
	let emoji = emojies.find(emoji=>emoji.name===name)
	if(emoji)
		return emoji;
}

export const emojies = get_emojies()

