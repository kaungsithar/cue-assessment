import { RouterProvider } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./router";

const queryClient = new QueryClient();

function App() {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
      <Toaster position="top-center" />
    </MantineProvider>
  );
}

export default App;
