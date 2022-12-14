import {
  Badge,
  Box,
  Container,
  Flex,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconMessage } from "@tabler/icons";
import {
  IssueOpenedIcon,
  CheckCircleIcon,
  GitPullRequestIcon,
  GitPullRequestClosedIcon,
  GitPullRequestDraftIcon,
} from "@primer/octicons-react";
import { Issue } from "../../queries/Issue";
import { Label } from "../../queries/labels";

interface Props {
  data: Issue[];
  isPRs: boolean;
}

const Issues = ({ data, isPRs }: Props) => {
  const theme = useMantineTheme();
  const stateIcon = isPRs
    ? {
        open: <GitPullRequestIcon fill={theme.colors.green[9]} />,
        closed: <GitPullRequestClosedIcon fill={theme.colors.violet[9]} />,
        draft: <GitPullRequestDraftIcon />,
      }
    : {
        open: <IssueOpenedIcon fill={theme.colors.violet[9]} />,
        closed: <CheckCircleIcon fill={theme.colors.green[9]} />,
      };

  return (
    <>
      {data.map((isu) => {
        const state = isu.draft ? "draft" : isu.state;
        return (
          <Box
            key={isu.id}
            my="md"
            p="md"
            sx={(theme) => ({
              border: "1px solid" + theme.white,
              borderRadius: 8,
            })}
          >
            <Flex align="center">
              {stateIcon[state]}
              <Title ml={10} mb={2} order={1} size={16} color="" lineClamp={1}>
                {isu.title}
              </Title>
            </Flex>

            <Box mt="xs">
              <Badge
                mr={8}
                size="sm"
                variant="outline"
                color="gray"
                leftSection={<IconMessage size="8" />}
              >
                {isu.comments?.toLocaleString() ?? 0}
              </Badge>
              {isu.labels.map(renderLabel)}
            </Box>
          </Box>
        );
      })}
    </>
  );
};

const renderLabel = (l: Label) => (
  <Badge
    key={l.id}
    mr={8}
    size="sm"
    sx={() => ({
      borderColor: "#" + l.color,
      color: "#" + l.color,
    })}
    variant="outline"
  >
    {l.name}
  </Badge>
);

export default Issues;
