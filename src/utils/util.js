import http from "../api/api";

export const clickAction = async() => {
    try {
        const { data } = await http.get("/posts?limit=2000");
        return data;
    }
catch(err) {
    console.error(err)
}
}
