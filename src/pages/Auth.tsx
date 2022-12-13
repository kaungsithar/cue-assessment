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
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMutateUser, useUser } from "./../queries/User";
import { useNavigate } from "react-router-dom";
import { getAccessToken, setAccessToken } from "./../lib/auth";

function useForm() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const { mutateAsync } = useMutateUser();
  const valid = token ? true : false;

  const register = () => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
      setToken(e.target.value);
    return { onChange: handleChange, value: token, valid };
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;

    const toastId = toast.loading("Loggin In...");
    try {
      await mutateAsync(token);
      setAccessToken(token);
      toast.success("Success!", {
        id: toastId,
      });
      navigate("/");
    } catch (error) {
      toast.error("Failed to Log in", {
        id: toastId,
      });
    }
  };

  return { register, onSubmit, valid };
}

const Auth = () => {
  const navigate = useNavigate();
  const { register, onSubmit, valid } = useForm();

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken != null) navigate("/");
  }, []);

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
          {...register()}
          label="Github Access Token"
          placeholder="*******"
          description={desc}
        />
        <Button mt="lg" size="xs" type="submit" fullWidth disabled={!valid}>
          Log In
        </Button>
      </Box>
    </Center>
  );
};

export default Auth;
