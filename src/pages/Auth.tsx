import {
  PasswordInput,
  Code,
  Text,
  Center,
  Anchor,
  Button,
  Title,
  Box,
} from "@mantine/core";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useMutateUser } from "../queries/user";
import { useNavigate } from "react-router-dom";
import { setAccessToken, UserService } from "./../lib/auth";
import { updateAPIAuthHeader } from "../utils/GHApi";

function useForm() {
  const navigate = useNavigate();
  const { mutateAsync } = useMutateUser();
  const [token, setToken] = useState("");

  const isValid = token ? true : false;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const toastId = toast.loading("Loggin In...");

    try {
      const { data } = await mutateAsync(token);

      setAccessToken(token);
      UserService.saveInfo(data);
      updateAPIAuthHeader();

      toast.success("Success!", {
        id: toastId,
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to Log in", {
        id: toastId,
      });
    }
  };

  return { setToken, onSubmit, isValid };
}

const Auth = () => {
  const { setToken, onSubmit, isValid } = useForm();

  const desc = (
    <Text>
      You can create a token with <Code>public_repo</Code> permissions{" "}
      <Anchor
        href="https://github.com/settings/tokens/new?scopes=public_repo&description=Issue%20Explorer"
        target="_blank"
      >
        here
      </Anchor>
    </Text>
  );

  return (
    <Center style={{ height: "100vh", flexDirection: "column" }}>
      <Title order={2}>Please Add Github Access Token</Title>
      <Text size="xs">It's a simpler version of Github OAuth Setup 😉</Text>

      <Box component="form" mt="lg" onSubmit={onSubmit}>
        <PasswordInput
          autoFocus
          onChange={(e) => setToken(e.target.value)}
          label="Github Access Token"
          placeholder="*******"
          description={desc}
        />
        <Button mt="lg" size="xs" type="submit" fullWidth disabled={!isValid}>
          Log In
        </Button>
      </Box>
    </Center>
  );
};

export default Auth;
