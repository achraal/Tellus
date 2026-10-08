const paths = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  leaf: "M20 3C9 2 3 6 4 13c1 7 10 8 14 1 2-3 2-7 2-11Z M3 21l11-11",
  bag: "M5 7h14l2 14H3L5 7Z M8 8V6a4 4 0 0 1 8 0v2",
  box: "m3 7 9-4 9 4v10l-9 4-9-4V7Z m0 0 9 4 9-4 M12 11v10 M7 5l10 5",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3Z",
  search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0 m-2 5 6 6",
  arrow: "M4 12h16 m-6-6 6 6-6 6",
  chevron: "m9 5 7 7-7 7",
  down: "m6 9 6 6 6-6",
  up: "m7 14 5-5 5 5",
  plus: "M12 5v14 M5 12h14",
  close: "m6 6 12 12 M6 18 18 6",
  check: "m5 12 4 4L19 6",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M5 19l1-1 M18 6l1-1",
  moon: "M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z",
  trend: "m3 17 6-6 4 4 8-10 M15 5h6v6",
  truck:
    "M2 5h12v13H2V5Z M14 10h5l3 4v4h-8 M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  people:
    "M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3 M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M17 3a4 4 0 0 1 0 8 M18 14a4 4 0 0 1 4 4v3",
  wallet: "M3 5h16v4 M3 5v15h18V9H3a2 2 0 0 1 0-4 M16 13h5v4h-5z",
  calendar: "M4 5h16v16H4z M8 2v6 M16 2v6 M4 11h16",
  help: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5 M12 17h.01",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  download: "M12 3v12 m-5-5 5 5 5-5 M4 16v5h16v-5",
  filter: "M4 7h16 M7 12h10 M10 17h4",
  minus: "M5 12h14",
  trash: "M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z m-4 10 3 3 5-6",
};

export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.leaf} />
    </svg>
  );
}
