import { rest } from "msw";

const baseURL = "https://pp5-productivity-tool.herokuapp.com/";

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
            pk: 1,
            username: "PhantomPWR",
            email: "jeandevilliers@me.com",
            first_name: "",
            last_name: "",
            profile_id: 1,
            profile_image: "https://res.cloudinary.com/ci-pp5/image/upload/v1/media/../default_profile_ht7rq2"
        })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];