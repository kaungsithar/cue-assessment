import {
  Box,
  Container,
  Loader,
  Text,
  Center,
  SelectItem,
} from "@mantine/core";
import { Fragment, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { IssueQuery, useIssueInfiniteQuery } from "../../queries/issues";
import Issues from "./Issues";

import Nav from "../../components/Nav";
import SearchControls from "./SearchControls";

export function useIssue() {
  const { owner, repo } = useParams();
  const ownerRepo = `${owner}/${repo}`;
  let [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type");
  const labels = searchParams.get("labels")?.split(",") ?? [];
  let state = searchParams.get("state");
  if (!(state === "open" || state === "closed")) state = null;

  const isPR = type === "pr";

  const issueQuery: IssueQuery = {
    q,
    labels,
    ownerRepo,
    state,
    isPR,
  };
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useIssueInfiniteQuery(issueQuery);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return {
    data,
    isLoading,
    hasNextPage,
    inViewRef: ref,
    isPR,

    q,
    searchParams,
    setSearchParams,
    type,
    state,
    ownerRepo,
    labels,
  };
}

const IssuesPR = () => {
  const { data, isLoading, hasNextPage, inViewRef, isPR } = useIssue();
  return (
    <Container>
      <Nav />
      <SearchControls />

      {data?.pages.map((page) => (
        <Fragment key={page.next_page}>
          <Issues data={page.items} isPRs={isPR} />
        </Fragment>
      ))}

      <Box ta="center" mt="xl">
        {isLoading && <Text>Searching ...</Text>}
        {data?.pages[0].total_count === 0 && <Text>No results found</Text>}
      </Box>

      {data !== null && hasNextPage && (
        <Center ref={inViewRef} pb="md">
          <Loader size="sm" />
        </Center>
      )}
      {(data?.pages[0].total_count ?? 0) > 0 && hasNextPage === false && (
        <Center pb="md">
          <Text>End of Result</Text>
        </Center>
      )}
    </Container>
  );
};

export default IssuesPR;
