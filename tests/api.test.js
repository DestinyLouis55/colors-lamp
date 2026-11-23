describe("COLORS API Integration Tests", () => {
    test("SearchColors PHP endpoint returns valid search results", async () => {
        const response = await fetch(
    process.env.API_URL || "http://localhost/LAMP-Stack-DL/api/SearchColors.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    search: "blue",
                    userId: 42
                })
            }
        );

        expect(response.status).toBe(200);

        const data = await response.json();

        expect(data).toHaveProperty("results");
        expect(Array.isArray(data.results)).toBe(true);
        expect(data.results).toContain("Blue");
        expect(data.results).toContain("Dark Blue");
        expect(data).toHaveProperty("error", "");
    }, 15000);
});