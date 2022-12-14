import {
  Box,
  Container,
  Loader,
  SegmentedControl,
  TextInput,
  Text,
  Center,
  Select,
  SelectItem,
  Flex,
  MultiSelect,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { Fragment, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { usePRsQuery } from "../../queries/PRs";
import { IssueQuery, useIssueInfiniteQuery } from "./../../queries/Issue";
import Issues from "./Issues";
import LabelSelectItem from "./LabelSelectItem";
import { useLabelsQuery } from "../../queries/labels";

type IssueType = "issue" | "pr";
type IssueState = "open" | "closed" | "null";

const IssuesPR = () => {
  const { owner, repo } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type");
  const labels = searchParams.get("labels")?.split(",") ?? [];
  let state = searchParams.get("state");
  if(!(state === "open" || state === "closed"))
    state = null;
  
  const isPR = type === "pr";
  const {data: labelsList} = useLabelsQuery(`${owner}/${repo}`);

  const issueQuery : IssueQuery = {
    q,
    labels,
    ownerRepo: `${owner}/${repo}`, 
    state,
    isPR,
  }
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useIssueInfiniteQuery(issueQuery);
  
  const selectData : SelectItem[] = labelsList?.map(l => ({value: l.name, label: l.name, color: l.color})) ?? [];

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
        
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const q = formData.get("search")?.toString();
          q ? searchParams.set("q", q) : searchParams.delete("q");
          setSearchParams(searchParams);
        }}>
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
        </form>
        <Flex py="sm">
          <SegmentedControl
            mr="md"
            defaultValue={type??"issue"}
            onChange={(v: IssueType) => {
              v === "issue"
                ? searchParams.delete("type")
                : searchParams.set("type", v);
              setSearchParams(searchParams);
            }}
            data={[
              { label: "Issues", value: "issue" },
              { label: "Pull Requests", value: "pr" },
            ]}
          />
          <SegmentedControl
          mr="md"
            defaultValue={state ?? "all"}
            onChange={(v: IssueState | "all") => {
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
          
          {selectData.length > 0 && 
          <MultiSelect 
          defaultValue={labels}
          onChange={(v) => {
            if(v.length > 0){
              searchParams.set("labels",v.join(','));
            }else{
              searchParams.delete("labels");
            }
            setSearchParams(searchParams);
          }}
          placeholder="Labels"
          data={selectData}
          itemComponent={LabelSelectItem}
          searchable
          />}
          
        </Flex>
    
        </Box>

      <Box ta="center" mt="xl">
        {isLoading && <Text>Searching ...</Text>}
        {data?.pages[0].total_count === 0 && <Text>No results found</Text>}
      </Box>

      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          <Issues data={page.items} isPRs={isPR} />
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
