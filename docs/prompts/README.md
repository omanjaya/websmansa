# Prompt Templates untuk Droid (GLM-4.6)

## 📋 Overview

Folder ini berisi template prompts yang siap pakai untuk Droid (GLM-4.6) dalam development project SMANSA.

## 📚 Available Templates

| File | Purpose | When to Use |
|------|---------|-------------|
| **00-project-briefing.md** | Project overview & briefing | First time working with Droid |
| **01-backend-setup.md** | Laravel 11 + Octane setup | Start backend development |
| **02-frontend-setup.md** | Next.js 14 + TypeScript setup | Start frontend development |
| **03-database-migrations.md** | Generate all migrations | After backend setup |

## 🚀 How to Use

### Step 1: Choose Template

Pilih template yang sesuai dengan task yang akan dikerjakan.

### Step 2: Copy Content

Buka file template dan copy seluruh content.

### Step 3: Paste to Droid

```bash
# Start Droid
cd /home/omanjaya/project/smansa
droid

# Paste the template content
```

### Step 4: Let Droid Work

Droid akan:

1. Membaca dokumentasi yang direferensikan
2. Menganalisis requirements
3. Generate code/structure yang diperlukan
4. Follow best practices dari CODE_QUALITY.md

## 💡 Tips

1. **Always start with 00-project-briefing.md** untuk context
2. **Reference documentation files** yang relevan
3. **One task at a time** - jangan mix multiple templates
4. **Review output** - check apakah sesuai dengan standards
5. **Iterate** - provide feedback untuk improvements

## 📝 Template Structure

Setiap template berisi:

- **Task**: Apa yang harus dikerjakan
- **Documentation Reference**: File mana yang harus dibaca
- **Tech Stack**: Technology yang digunakan
- **Setup Tasks**: Step-by-step instructions
- **Requirements**: Standards yang harus diikuti
- **Expected Output**: Hasil yang diharapkan
- **Important Reminders**: Hal-hal kritis

## 🔄 Workflow Recommended

```
1. Project Briefing (00-project-briefing.md)
   ↓
2. Backend Setup (01-backend-setup.md)
   ↓
3. Frontend Setup (02-frontend-setup.md)
   ↓
4. Database Migrations (03-database-migrations.md)
   ↓
5. Continue with IMPLEMENTATION_ROADMAP.md
```

## ✅ Before Starting

Pastikan:

- [ ] Droid (GLM-4.6) installed
- [ ] Documentation di `/home/omanjaya/project/smansa/websmansanew/docs/` complete
- [ ] Development environment ready (PHP 8.3, Node 20, etc.)
- [ ] Git repository initialized

## 📖 Additional Resources

Semua template reference dokumentasi di `../`:

- ARCHITECTURE.md
- CODE_QUALITY.md
- DATABASE_SCHEMA.md
- API_DESIGN.md
- UI_UX_GUIDELINES.md
- SEO_STRATEGY.md
- TECH_STACK.md
- DEPLOYMENT.md
- IMPLEMENTATION_ROADMAP.md

## 🎯 Expected Behavior

Dengan templates ini, Droid akan:

- ✅ Generate consistent code
- ✅ Follow architecture patterns
- ✅ Apply SOLID principles
- ✅ Include proper type safety
- ✅ Add error handling
- ✅ Follow coding standards

## 🔧 Customization

Anda bisa customize templates untuk:

- Different phases of development
- Specific features
- Bug fixes
- Refactoring tasks

Just maintain the structure dan reference documentation yang relevan.

## 📞 Support

Jika ada issues:

1. Check documentation reference
2. Review CODE_QUALITY.md standards
3. Consult ARCHITECTURE.md patterns
4. Ask for clarification in prompt

---

**Happy Coding with Droid! 🚀**
