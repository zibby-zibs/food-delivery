import { GET_USER } from "@/graphql/actions/getUser.action";
import { UserResponse } from "@/types/user";
import { useQuery } from "@apollo/client";

const useUser = () => {
  const { loading, data } = useQuery<UserResponse>(GET_USER);

  return {
    loading,
    user: data?.getLoggedInUser,
  };
};

export default useUser;
