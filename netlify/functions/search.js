exports.handler = async function (event) {

  try {
    const query =
      event.queryStringParameters?.q?.trim();
    if (!query) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Please enter a character."
        })
      };

    }
    const apiURL =
      `https://amiiboapi.org/api/amiibo/?character=${encodeURIComponent(query)}`;
    console.log("Requesting:", apiURL);
    const response = await fetch(apiURL);
    if (!response.ok) {
      console.error(
        "Amiibo API error:",
        response.status
      );
      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: `Amiibo API request failed: ${response.status}`
        })
      };
    }
    const data = await response.json();
    const results =
      data.amiibo?.map((amiibo) => {
        return {
          id:
            `${amiibo.head || ""}${amiibo.tail || ""}`,
          name:
            amiibo.name || "Unknown Amiibo",
          character:
            amiibo.character || "Unknown Character",
          gameSeries:
            amiibo.gameSeries || "Unknown Game",
          amiiboSeries:
            amiibo.amiiboSeries || "Unknown Series",
          type:
            amiibo.type || "Unknown Type",
          image:
            amiibo.image || "",
          imgwebp:
            amiibo.imgwebp || "",
          release:
            amiibo.release || null
        };
      }) || [];
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        results: results
      })
    };
  } catch (error) {
    console.error(
      "Function error:",
      error
    );
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error:
          error.message ||
          "Something went wrong while searching Amiibo."
      })
    };
  }
};
