"babel transform-react-jsx";

// Daten mit den Artikeln unserer Webseite
const ContentItems = [
  {
    id: 1,
    type: "article",
    title: "Article Title",
    content: "This is a short article description.",
  },
  {
    id: 42,
    type: "details",
    title: "Click here for more",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Curabitur ultricies, ipsum sit amet placerat faucibus, quam lacus
    lobortis neque, lacinia lobortis neque felis a quam.`,
  },
];

function MyApp() {
  return (
    <>
      <Header />
      <Navigation />
      <QuickInfo />
      <MainContent items={ContentItems} />
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header>
      <h1>My Website</h1>
    </header>
  );
}

function Navigation() {
  return (
    <nav>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
  );
}

function QuickInfo() {
  return (
    <aside>
      <h3>Related Info</h3>
      <p>Some additional information goes here.</p>
    </aside>
  );
}

function MainContent({ items }) {
  return (
    <section>
      <h2>Welcome</h2>
      {items.map(item => <ContentItem key={item.id} item={item} />)}
    </section>
  );
}

function ContentItem({ item }) {
  if (item.type === "article") {
    return (
      <article>
        <h3>{item.title}</h3>
        <p>{item.content}</p>
      </article>
    );
  }
  if (item.type === "details") {
    return (
      <details>
        <summary>{item.title}</summary>
        {item.content}
      </details>
    );
  }
  return undefined;
}

function Footer() {
  return (
    <footer>
      <p>&copy; 2025 My Website</p>
    </footer>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MyApp />);
