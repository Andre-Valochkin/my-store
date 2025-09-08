import axios from "axios";
import xml2js from "xml2js";

export async function fetchAndParseXML(url) {
	try {
		const { data } = await axios.get(url);
		const result = await xml2js.parseStringPromise(data);
		return result;
	} catch (error) {
		throw new Error("Ошибка загрузки или парсинга XML: " + error.message);
	}
}
