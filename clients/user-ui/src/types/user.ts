interface Avatar {
  id: string;
  public_id: string;
  url: string;
}

export interface UserResponse {
  getLoggedInUser: {
    user: {
      name: string;
      email: string;
      phone_number: string;
      address: string;
      avatar: Avatar;
    } | null;
    accessToken: string;
    refreshToken: string;
  } | null;
}
