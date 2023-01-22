export async function logger(
  message: string,
  logLevel: string
): Promise<Response> {
  try {
    const body = JSON.stringify({ message: message, "log.level": logLevel });
    await fetch("LOGZ_IO_URL", {
      method: "POST",
      body: body,
    });

    return new Response(null, { status: 200 });
  } catch (err) {
    const errorMessage = "Error while sending logs";
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
