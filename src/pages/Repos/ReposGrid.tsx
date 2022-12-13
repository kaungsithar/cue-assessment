import { Badge, Box, Flex, Grid, Text, Title } from "@mantine/core";
import { IconStar, IconGitFork } from "@tabler/icons";
import { Link } from "react-router-dom";
import { Repo } from "./../../queries/Repo";

interface Props {
  data: Repo[];
}

const ReposGrid = ({ data }: Props) => {
  return (
    <Grid>
      {data.map((r) => (
        <Grid.Col key={r.id} span={3}>
          <Link
            to={`${r.owner.login}/${r.name}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Flex
              direction="column"
              justify="space-between"
              sx={(theme) => ({
                border: "1px solid " + theme.white,
                borderRadius: 8,
                padding: ".5em .75em",
                height: "100%",
                textDecoration: "none",
              })}
            >
              <Box>
                <Title order={4} lineClamp={2} sx={{ wordBreak: "break-word" }}>
                  {r.name}
                </Title>
                <Text
                  lineClamp={2}
                  span
                  fz="sm"
                  sx={{ wordBreak: "break-word", lineHeight: 1.2 }}
                >
                  {r.owner.login}
                </Text>
              </Box>
              <Box mt="xs">
                <Badge
                  mr="xs"
                  size="sm"
                  color="yellow"
                  leftSection={<IconStar size="8" />}
                >
                  {r.stargazers_count.toLocaleString()}
                </Badge>
                <Badge
                  size="sm"
                  color="gray"
                  variant="outline"
                  leftSection={<IconGitFork size="8" />}
                >
                  {r.forks.toLocaleString()}
                </Badge>
              </Box>
            </Flex>
          </Link>
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default ReposGrid;
