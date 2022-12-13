import {
  Box,
  Container,
  Loader,
  SegmentedControl,
  TextInput,
  Text,
  Center,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { Fragment, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { usePRsQuery } from "../../queries/PRs";
import { useIssueInfiniteQuery } from "./../../queries/Issue";
import Issues from "./Issues";

type ActiveType = "issues" | "prs";
type IssuesState = "all" | "open" | "closed";

const IssuesPR = () => {
  const { owner, repo } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = (searchParams.get("type") ?? "issues") as ActiveType;
  const state = (searchParams.get("state") ?? "all") as IssuesState;

  const isPRs = type === "prs";

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useIssueInfiniteQuery(q, `${owner}/${repo}`, state, isPRs);
  console.log(data?.pages);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <Container>
      <Box
        bg="dark.7"
        pos="sticky"
        top={0}
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
          placeholder="Search in title..."
          label={`${owner}/${repo}`}
          defaultValue={q}
          description="Search for issues or pull requests"
          name="search"
          rightSection={
            isLoading ? <Loader size="xs" /> : <IconSearch size={14} />
          }
        />
        <Box py="sm">
          <SegmentedControl
            mr="md"
            defaultValue={type}
            onChange={(v: ActiveType) => {
              v === "issues"
                ? searchParams.delete("type")
                : searchParams.set("type", v);
              setSearchParams(searchParams);
            }}
            data={[
              { label: "Issues", value: "issues" },
              { label: "Pull Requests", value: "prs" },
            ]}
          />
          <SegmentedControl
            defaultValue={state}
            onChange={(v: IssuesState) => {
              v === "all"
                ? searchParams.delete("state")
                : searchParams.set("state", v);
              setSearchParams(searchParams);
            }}
            data={[
              { label: "All", value: "all" },
              { label: "Open", value: "open" },
              { label: "Closed", value: "closed" },
            ]}
          />
        </Box>
      </Box>

      <Box ta="center" mt="xl">
        {isLoading && <Text>Searching ...</Text>}
        {data?.pages[0].total_count === 0 && <Text>No results found</Text>}
      </Box>

      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          <Issues data={page.items} isPRs={isPRs} />
        </Fragment>
      ))}
      {/* {data != null && } */}
      {data !== null && hasNextPage && (
        <Center ref={ref} pb="md">
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
