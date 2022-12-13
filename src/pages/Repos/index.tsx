import React, { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Loader,
  Text,
  TextInput,
  Title,
  Transition,
} from "@mantine/core";
import { IconStar, IconSearch, IconGitFork } from "@tabler/icons";
import ReposGrid from "./ReposGrid";
import { useRepoQuery } from "../../queries/Repo";

const Repos = () => {
  const [q, setQ] = useState("");
  const { data, status, isLoading, refetch } = useRepoQuery(q);

  return (
    <Box p="md">
      {status}
      <Box ta="right">
        <Button component="a" variant="subtle" href="/logout">
          Log Out
        </Button>
      </Box>
      <Box
        component="form"
        mb="md"
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const q = formData.get("search")?.toString() ?? "";
          setQ(q);
          
        }}
      >
        <TextInput
          placeholder="Type 'react' or 'vue'"
          label="Search Respositories"
          name="search"
          rightSection={
            isLoading ? <Loader size="xs" /> : <IconSearch size={14} />
          }
        />
      </Box>

      {data == null && (
        <Box ta="center" mt="xl">
          {isLoading ? (
            <Text>Searching ...</Text>
          ) : (
            <Text>Search for a repository</Text>
          )}
        </Box>
      )}

      {data != null && <ReposGrid data={data.items} />}
    </Box>
  );
};

export default Repos;
