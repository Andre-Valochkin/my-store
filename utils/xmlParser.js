import axios from "axios";
import xml2js from "xml2js";

export async function fetchAndParseXML(url) {
	try {
		const { data } = await axios.get(url, {
			headers: { 'User-Agent': 'Mozilla/5.0' } // для надёжности
		});
		const result = await xml2js.parseStringPromise(data);
		return result;
	} catch (error) {
		console.error("Ошибка в fetchAndParseXML:", error);
		throw new Error("Ошибка загрузки или парсинга XML: " + error.message);
	}
}
