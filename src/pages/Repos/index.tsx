import React, { Fragment, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
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
import { useRepoInfiniteQuery } from "../../queries/repos";
import { useSearchParams } from "react-router-dom";
import Nav from "../../components/Nav";
import { useInView } from "react-intersection-observer";

const Repos = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const { data, fetchNextPage, isFetchingNextPage, isFetching, hasNextPage } =
    useRepoInfiniteQuery(q);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <Container>
      <Nav homeButton={false} />
      <Box
        component="form"
        pos="sticky"
        top={0}
        bg="dark.7"
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

      <Box ta="center" mt="xl">
        {isFetching && <Text>Searching ...</Text>}
        {data?.pages[0].total_count === 0 && <Text>No results found</Text>}
      </Box>

      {data?.pages.map((page) => (
        <Fragment key={page.next_page}>
          <ReposGrid data={page.items} />
        </Fragment>
      ))}

      {data !== null && hasNextPage && (
        <Center ref={ref} py="md">
          <Loader size="sm" />
        </Center>
      )}
      {(data?.pages[0].total_count ?? 0) > 0 && hasNextPage === false && (
        <Center py="md">
          <Text>End of Result</Text>
        </Center>
      )}
    </Container>
  );
};

export default Repos;
