import DashboardCards from "../../dashboardComponents/container";
import HomeButton from "./home";
import AppMenu from "./dropdownMenu";

export default function Navbar() {
  return (
    <>
      <DashboardCards type="navbar">
        <HomeButton />
        <AppMenu />
      </DashboardCards>
    </>
  );
}
