import UserSchema from "@/schemas/users";

declare namespace Queries {
  export namespace Register {
    export type Body = {
      username: string;
      email: string;
      password: string;
    }

    export type Data = {
      username: string;
    }
  }

  export namespace Activate {
    export type Body = {
      token: string;
    }

    export type Data = boolean;
  }

  export namespace Login {
    export type Body = {
      email: string;
      password: string;
    }

    export type Data = UserSchema;
  }

  export namespace SessionValidate {
    export type Body = {
      id: string;
      token_value: string;
      token_signature: string;
      token_revalidate_value: string;
      token_revalidate_signature: string;
    }

    export type Data = {
      token_value: string;
      token_signature: string;
    };
  }

  export namespace Logout {
    export type Body = {
      id: string;
      token_value: string;
    }

    export type Data = boolean;
  }
}

export default Queries;
