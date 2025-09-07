import axios from "axios";
import xml2js from "xml2js";

const XML_URL = "https://i-maxi.com/ocext_yml_feed.xml";

export async function fetchAndParseXML() {
	const { data } = await axios.get(XML_URL);
	return await xml2js.parseStringPromise(data);
}
