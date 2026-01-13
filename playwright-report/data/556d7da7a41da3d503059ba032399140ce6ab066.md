# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "Create Account" [level=1] [ref=e5]
      - paragraph [ref=e6]: Get started
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: Name
        - textbox "Name" [active] [ref=e10]:
          - /placeholder: Your Name
      - generic [ref=e11]:
        - generic [ref=e12]: Email
        - textbox "Email" [ref=e13]:
          - /placeholder: user@gmail.com
          - text: test1768304687514@example.com
      - generic [ref=e14]:
        - generic [ref=e15]: Password
        - textbox "Password" [ref=e16]: password123
      - generic [ref=e17]:
        - generic [ref=e18]: Role
        - combobox [ref=e19]:
          - generic: User
          - img
        - combobox [ref=e20]
      - button "Create Account" [ref=e21]
    - generic [ref=e22]:
      - text: Already have an account?
      - link "Sign in" [ref=e23]:
        - /url: /login
  - button "Open Next.js Dev Tools" [ref=e29] [cursor=pointer]:
    - img [ref=e30]
  - alert [ref=e35]
```