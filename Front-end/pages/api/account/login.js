import cookie from "cookie";

export default async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const body = JSON.stringify({
      email,
      password,
    });

    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/token/`,

        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: body,
        }
      );

      const data = await apiRes.json();

      if (apiRes.status === 200) {
        res.setHeader("Set-Cookie", [
          cookie.serialize("access", data.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 9 * 60,
            sameSite: "strict",
            path: "/api/",
          }),
          cookie.serialize("refresh", data.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 9 * 60,
            sameSite: "strict",
            path: "/api/",
          }),
        ]);

        return res.status(200).json({
          success: "Logged in successfully",
          data: data,
        });
      } else {
        return res.status(apiRes.status).json({
          error: "Authentication failed",
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: "Something went wrong when authenticating",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} now allowed` });
  }
};
