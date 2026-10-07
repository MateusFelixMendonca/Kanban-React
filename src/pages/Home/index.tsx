import { BoardList } from "../../components/BoardList";
import { MainTemplate } from "../../templates/MainTemplate";
import { Container } from "../../components/Container";

export function Home() {
  return (
    <MainTemplate>
      <Container>
        <BoardList />
      </Container>
    </MainTemplate>
  );
}