import {
  Box,
  Flex,
  Loader,
  MultiSelect,
  SegmentedControl,
  SelectItem,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useIssue } from ".";
import { useLabelsQuery } from "../../queries/labels";
import LabelSelectItem from "./LabelSelectItem";

type IssueType = "issue" | "pr";
type IssueState = "open" | "closed" | "null";

function useLabels(ownerRepo: string) {
  const { data: labelsList } = useLabelsQuery(ownerRepo);
  const selectData: SelectItem[] =
    labelsList?.map((l) => ({
      value: l.name,
      label: l.name,
      color: l.color,
    })) ?? [];

  return { selectData };
}

const SearchControls = () => {
  const {
    isLoading,
    q,
    searchParams,
    setSearchParams,
    type,
    state,
    ownerRepo,
    labels,
  } = useIssue();
  const { selectData } = useLabels(ownerRepo);

  const updateSearchParam = (
    name: string,
    defaultValue: string,
    value: string
  ) => {
    value === defaultValue
      ? searchParams.delete(name)
      : searchParams.set(name, value);
    setSearchParams(searchParams);
  };
  return (
    <Box bg="dark.7" pos="sticky" top={0}>
      <form
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
          placeholder="Search in title..."
          label={ownerRepo}
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
          defaultValue={type ?? "issue"}
          onChange={(v: IssueType) => {
            updateSearchParam("type", "issue", v);
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
            updateSearchParam("state", "all", v);
          }}
          data={[
            { label: "All", value: "all" },
            { label: "Open", value: "open" },
            { label: "Closed", value: "closed" },
          ]}
        />

        {selectData.length > 0 && (
          <MultiSelect
            defaultValue={labels}
            onChange={(v) => {
              if (v.length > 0) {
                searchParams.set("labels", v.join(","));
              } else {
                searchParams.delete("labels");
              }
              setSearchParams(searchParams);
            }}
            placeholder="Labels"
            data={selectData}
            itemComponent={LabelSelectItem}
            searchable
          />
        )}
      </Flex>
    </Box>
  );
};

export default SearchControls;
