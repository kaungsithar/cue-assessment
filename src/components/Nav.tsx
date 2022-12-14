import { ActionIcon, Avatar, Box, Button, Flex, Text } from "@mantine/core";
import { IconHome } from "@tabler/icons";
import { Link } from "react-router-dom";
import { UserService } from "../lib/auth";
import { LogOut } from "./RouteHelpers";

interface Props {
  homeButton?: boolean;
}

const Nav = ({ homeButton = true }: Props) => {
  const user = UserService.get();
  if (user === null) return <LogOut />;

  return (
    <nav>
      <Box my="md">
        <Flex align="center">
          {homeButton && (
            <Link to="/">
              <ActionIcon>
                <IconHome size={24} />
              </ActionIcon>
            </Link>
          )}
          <Avatar
            ml="auto"
            src={user.avatar_url}
            alt={`avatar of user ${user.login}`}
          />
          <Text mx="md">{user.login}</Text>
          <Button component="a" variant="subtle" href="/logout">
            Log Out
          </Button>
        </Flex>
      </Box>
    </nav>
  );
};
export default Nav;
