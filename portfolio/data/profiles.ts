export type CodingProfile = {
  name: string;
  username: string;
  url: string;
};

export const codingProfiles: CodingProfile[] = [
  { name: "GitHub", username: "hars7itIT", url: "https://github.com/hars7itIT" },
  { name: "LeetCode", username: "YDHheqYlVe", url: "https://leetcode.com/u/YDHheqYlVe/" },
  { name: "CodeChef", username: "hars7itIT", url: "https://www.codechef.com/users/hars7itIT" },
  { name: "Codeforces", username: "hars7itIT", url: "https://codeforces.com/profile/hars7itIT" },
];

export const socialLinks = {
  email: "Chandreshgupta999@gmail.com",
  phone: "+91 8052702560",
  linkedin: "https://www.linkedin.com/in/harshit-gupta-473821378?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  github: "https://github.com/hars7itIT",
  instagram: "https://www.instagram.com/hars7it_?igsh=MTVpaW5vN2dpN2V2aQ%3D%3D",
  twitter: "https://x.com/HarshitGup52263",
};

export const achievements: { title: string; note: string }[] = [
  {
    title: "Second-Year CSE Student",
    note: "Pursuing Bachelor of Engineering in Computer Science & Engineering at UIET, Panjab University, Chandigarh.",
  },
  {
    title: "Open Source Contributor",
    note: "Actively building full-stack applications and AI-powered workflow automations.",
  },
];
