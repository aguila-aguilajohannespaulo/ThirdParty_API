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
          error: "Please enter an Amiibo or character."
        })
      };
    }
    const apiURL =
      `https://www.amiiboapi.com/api/amiibo/?character=${encodeURIComponent(query)}`;
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
          error: "Amiibo API request failed."
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
      "Netlify function error:",
      error
    );

    return {

      statusCode: 500,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        error:
          "Something went wrong while searching Amiibo."

      })

    };

  }

};
