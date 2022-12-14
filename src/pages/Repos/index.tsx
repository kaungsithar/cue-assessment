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
import { useRepoQuery } from "../../queries/repos";
import { useSearchParams } from "react-router-dom";
import Nav from "../../components/Nav";

const Repos = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const { data,isFetching } = useRepoQuery(q);

  return (
    <Container>
      <Nav homeButton={false}/>
      <Box
        component="form"
        mb="md"
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const q = formData.get("search")?.toString();
          q ? searchParams.set("q", q) : searchParams.delete("q");
          setSearchParams(searchParams);
        }}
      >
        <TextInput
        autoFocus
          defaultValue={q}
          placeholder="Type 'react' or 'vue'"
          label="Search Respositories"
          name="search"
          rightSection={
            isFetching ? <Loader size="xs" /> : <IconSearch size={14} />
          }
        />
      </Box>

      {!q && <Text ta="center">Search for a repository</Text>}

      {isFetching && <Text ta="center">Searching ...</Text>}

      {data != null && <ReposGrid data={data.items} />}
    </Container>
  );
};

export default Repos;
