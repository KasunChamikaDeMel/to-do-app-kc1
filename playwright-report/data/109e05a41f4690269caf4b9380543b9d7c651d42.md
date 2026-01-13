# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "Create Account" [level=1] [ref=e5]
      - paragraph [ref=e6]: Get started
    - generic [ref=e7]:
      - generic [ref=e8]: error !
      - generic [ref=e9]:
        - generic [ref=e10]: Name
        - textbox "Name" [ref=e11]:
          - /placeholder: Your Name
          - text: Test User 1768304687515
      - generic [ref=e12]:
        - generic [ref=e13]: Email
        - textbox "Email" [ref=e14]:
          - /placeholder: user@gmail.com
          - text: test1768304687515@example.com
      - generic [ref=e15]:
        - generic [ref=e16]: Password
        - textbox "Password" [ref=e17]: password123
      - generic [ref=e18]:
        - generic [ref=e19]: Role
        - combobox [ref=e20]:
          - generic: User
          - img
        - combobox [ref=e21]
      - button "Create Account" [ref=e22]
    - generic [ref=e23]:
      - text: Already have an account?
      - link "Sign in" [ref=e24] [cursor=pointer]:
        - /url: /login
  - button "Open Next.js Dev Tools" [ref=e30] [cursor=pointer]:
    - img [ref=e31]
  - alert [ref=e35]
```