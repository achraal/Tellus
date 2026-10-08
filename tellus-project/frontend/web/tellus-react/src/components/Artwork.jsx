export function Landscape() {
  return (
    <svg
      className="landscape"
      viewBox="0 0 650 300"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="462" cy="86" r="52" fill="#d6e5a0" opacity=".9" />
      <circle cx="462" cy="86" r="72" stroke="#cfdda0" opacity=".12" />
      <circle cx="462" cy="86" r="95" stroke="#cfdda0" opacity=".08" />
      <path
        d="M0 231C114 146 202 214 298 151S461 139 650 91V300H0Z"
        fill="#395d37"
      />
      <path
        d="M0 265C130 199 224 186 340 221S528 182 650 151V300H0Z"
        fill="#6c8446"
      />
      <path d="M168 300C269 193 420 151 650 233V300Z" fill="#9baf66" />
      <path
        d="M384 300c69-55 169-72 266-61M304 300c103-83 217-109 346-77M238 300c107-108 246-126 412-101"
        stroke="#304f2b"
        strokeWidth="3"
        opacity=".5"
      />
      <path
        d="M0 269c128-70 258-62 337-23M0 286c104-61 214-68 307-34M35 300c76-45 164-59 239-42"
        stroke="#acc078"
        strokeWidth="2"
        opacity=".6"
      />
      <path d="M497 180v-36h37v36" fill="#d6d5af" />
      <path d="m489 145 27-24 27 24" fill="#1b3a20" />
      <path d="M511 158h10v22" fill="#395d37" />
      <path d="M580 169v-50" stroke="#253f27" strokeWidth="5" />
      <ellipse cx="580" cy="120" rx="17" ry="31" fill="#2b4a2c" />
      <path d="M565 172v-34" stroke="#253f27" strokeWidth="3" />
      <ellipse cx="565" cy="134" rx="13" ry="22" fill="#42633a" />
      <path
        d="m361 89 7-4 7 4 m22-24 6-3 6 3"
        stroke="#d6e5a0"
        strokeWidth="2"
        opacity=".7"
      />
    </svg>
  );
}

export function Produce({ kind = "leaf", className = "" }) {
  return (
    <svg
      className={`produce-art ${className}`}
      viewBox="0 0 200 140"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="100" cy="120" rx="53" ry="7" fill="#253c20" opacity=".08" />
      {kind === "leaf" && (
        <g>
          <path
            d="M97 117C53 100 43 77 53 65c-10-18 5-31 17-29 2-22 22-24 33-10 17-17 35-7 34 10 23 0 23 21 13 32 8 20-12 38-45 49Z"
            fill="#4e773c"
          />
          <path
            d="M99 116C74 92 64 65 74 50c9 5 13 21 17 24-2-24 2-37 12-48 13 18 16 36 12 50 12-16 22-21 31-18-4 32-20 49-47 58Z"
            fill="#6c974e"
          />
          <path
            d="m98 127 6-82 M102 82 81 62 M102 99l25-23 M102 108 72 87"
            stroke="#c0d68a"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}
      {kind === "potato" && (
        <g>
          <ellipse
            cx="80"
            cy="85"
            rx="43"
            ry="31"
            transform="rotate(-27 80 85)"
            fill="#b48b59"
          />
          <ellipse
            cx="124"
            cy="91"
            rx="39"
            ry="29"
            transform="rotate(20 124 91)"
            fill="#d4ae77"
          />
          <ellipse
            cx="105"
            cy="55"
            rx="35"
            ry="27"
            transform="rotate(-12 105 55)"
            fill="#dec18b"
          />
          <path
            d="m93 44 3 2 m18 15 3-1 M59 79l3 2 m20 18 2-2 m43-13 3 2 m15 16 2-2 M108 106l3 1"
            stroke="#977443"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}
      {kind === "corn" && (
        <g>
          <path
            d="M90 117C75 93 71 61 90 27c4-8 13-8 17 0 19 35 20 66 0 91Z"
            fill="#e8b849"
          />
          <path
            d="M92 33v77 M102 33v77 M111 46v51 M83 48v47 M83 48h30 M80 59h36 M80 70h39 M81 81h37 M84 92h32 M88 103h23"
            stroke="#f8d776"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M100 123C56 113 51 67 55 49c26 18 33 46 45 74Z"
            fill="#6d8742"
          />
          <path
            d="M99 123c39-15 51-55 48-76-26 17-38 48-48 76Z"
            fill="#8aa351"
          />
          <path
            d="M63 68c5 23 16 41 36 55 m36-53c-6 25-17 41-34 53"
            stroke="#b4c77b"
            strokeWidth="2"
          />
        </g>
      )}
      {kind === "tomato" && (
        <g>
          <circle cx="75" cy="86" r="33" fill="#c55842" />
          <circle cx="122" cy="85" r="39" fill="#e77655" />
          <path
            d="m120 53-18-13 7 17-18 7 24 2 7 13 5-15 23 1-20-9 2-16Z"
            fill="#527442"
          />
          <path
            d="m73 57-11-7 4 12-13 5 17 1 8 9 1-12 16-4-17-2Z"
            fill="#527442"
          />
          <path
            d="M101 83c-4 9-2 20 3 24"
            stroke="#f4a58a"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      )}
      {kind === "carrot" && (
        <g transform="rotate(25 100 75)">
          <path
            d="M81 48c1-14 40-14 41 0 0 24-20 76-22 79-5-4-20-60-19-79Z"
            fill="#df8e43"
          />
          <path
            d="M101 42c-13-13-23-23-17-32 12 2 16 13 17 25 2-20 9-31 18-29 7 12-5 25-15 37"
            fill="#69864c"
          />
          <path
            d="m85 62 13 2 m9 15 10-2 m-29 12 10 2 m2 16 8-2"
            stroke="#bb6b33"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}
      {kind === "avocado" && (
        <g>
          <path
            d="M112 41c-20 0-18 13-31 30-28 37-11 52 15 51 28-1 44-23 35-47-9-25-4-34-19-34Z"
            fill="#456a39"
          />
          <path
            d="M81 26c-18 1-13 23-24 42-23 39-1 56 23 52 30-5 40-28 27-51C94 46 99 25 81 26Z"
            fill="#81994c"
          />
          <path
            d="M80 35c-12 0-8 19-19 37-18 30-2 42 18 40 21-3 33-21 20-39C86 54 93 35 80 35Z"
            fill="#d8dc94"
          />
          <ellipse cx="79" cy="87" rx="17" ry="20" fill="#956341" />
          <ellipse cx="75" cy="82" rx="10" ry="13" fill="#ac7950" />
        </g>
      )}
    </svg>
  );
}
