export const reverseGeocode = async (coordinates) => {
    if (!coordinates || !coordinates.includes(",")) return "Nepoznata lokacija";

    const [lat, lng] = coordinates.split(",").map(c => c.trim());
    console.log("Šaljem na API -> Lat:", lat, "Lon:", lng);

    try {

        const response = await fetch(

            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=sr-Latn,hr,en`,
            {
                headers: {
                    'Accept-Language': 'sr-Latn, sr, hr, bs'
                }
            }
        );
        const data = await response.json();


        return data.display_name || "Adresa nije pronađena";
    } catch (error) {
        console.error("Greška pri geokodiranju:", error);
        return coordinates;
    }
};