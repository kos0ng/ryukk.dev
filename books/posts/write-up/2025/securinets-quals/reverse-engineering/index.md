# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Topic</th></tr></thead><tbody><tr><td><a href="#c0d3_fu5-499-pts">C0d3_Fu5 (499 pts)</a> 🥇</td><td>C#, Obfuscated, Harmony </td></tr></tbody></table>

## C0d3\_Fu5 (499 pts)

### Description

\-

### Solution

Given C# executable that hardly obfuscated.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FEbIiVT95s1avoDfCW1ig%2Fimage.png?alt=media&amp;token=b82c158e-baae-451d-b579-3a62fbb7f290" alt=""><figcaption></figcaption></figure>

Through running the executable, we can see that there is a form created.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FQQQmGarJoKrhjuCdBlVU%2Fimage.png?alt=media&amp;token=9b987477-a741-4895-b17c-89abfc08c318" alt=""><figcaption></figcaption></figure>

We can see that there is a button, but it is disabled. Since it is a crackme challenge, let's try to enable it. First, search variable with `Button` data type in decompiler, i use `dnSpyEx`.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FUMYRYuJIPV6iOHwGoap8%2Fimage.png?alt=media&amp;token=0b7a8618-faf7-464c-acab-98233c775dfe" alt=""><figcaption></figcaption></figure>

If we take a look on `Button` constructor, we can see that it use `setStyle` from `Control` class. Through debugging `createParams` i found a way to enable the `Button` which is by forcing the properties enabled to `True`. So the easiest way i think to modify it is by setting breakpoint on `Enabled` setter and change the value to `True`.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FvZND9AftIj9FYXiwkgF0%2Fimage.png?alt=media&amp;token=64bb4bbe-bf83-4146-a2e2-090033322536" alt=""><figcaption></figcaption></figure>

&#x20;Now, `TEST` is clickable, but when i clicked it it doesnt show flag.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FV4gX7ZQKaLf5UzZZmzBh%2Fimage.png?alt=media&amp;token=61e85521-45de-4b65-9c15-fa5bc0623093" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FjBKBHVq0ed7vKZ0OZIcM%2Fimage.png?alt=media&amp;token=806895e7-eec8-4fbf-accc-8bcad67c9b30" alt=""><figcaption></figcaption></figure>

Back to the class where Button lied, we found that there is `TextBox`, let's try to set breakpoint on getter of Text for `TextBox` Class.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FNzPJMiKhlm3hOBDMpLzR%2Fimage.png?alt=media&amp;token=8031f405-b21e-4106-b22c-2a6d768e4fd9" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FNjWs1c5SEq7x5fDmpOjp%2Fimage.png?alt=media&amp;token=ad4ab884-9be7-429f-9ea3-e64691fe8c6d" alt=""><figcaption></figcaption></figure>

Continue the process and right before showing Wrong Flag, the breakpoint on Text getter will be hitted. Doing step in we will see that the text value is empty "".

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FOSRtVrr5gqv3ogtXvZXI%2Fimage.png?alt=media&amp;token=60c1216f-a820-49bd-97d8-a1683d4df0dd" alt=""><figcaption></figcaption></figure>

If we continue to step in, the debugger will crash. By looking at the stack trace we know that probably it crashes because the caller function is a `native` function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Frj4i1PY2fP0skF1yuhUP%2Fimage.png?alt=media&amp;token=e0ed23e2-7392-4ef0-a664-ac61245d0f72" alt=""><figcaption></figcaption></figure>

But now, at least we've a nudge from a stack trace regarding what is the function actually did

* `FUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTNNBFUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTNNBFUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTN.e\u0015\u0015;|(A_0);`
  * `TextBox.Text()`

The next step we need to do is `deobfuscating` the initialization of function. Let's try with function that we found earlier, analyze function `e\u0015\u0015;|` and take a look on assigned by.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F9aCBIE9kVahz4Qf9N74a%2Fimage.png?alt=media&amp;token=03c3129c-c9fc-4ab2-a49b-c5f6da1c4ab7" alt=""><figcaption></figcaption></figure>

Take a look at function `FUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTNIcFUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTNIcFUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTN` and we can see that the function is creating a dynamic function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FCrnKUVaihCy9eLaS7aJB%2Fimage.png?alt=media&amp;token=ceaaa909-a2db-4094-b62d-1959c28a7a8c" alt=""><figcaption></figcaption></figure>

Setting up breakpoint on that function then we can get a brief idea about the function obfuscation things.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FR84A3vtVk0Ameny1NlAQ%2Fimage.png?alt=media&amp;token=1487edd1-5619-42dd-802b-61ea8fc64fe7" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FxMjA0XMFqhSvtMCFWPgs%2Fimage.png?alt=media&amp;token=efd19aa2-4d78-4d69-a32c-10bb1b7b5c2f" alt=""><figcaption></figcaption></figure>

We can print IL from that code by using `dncil` .

```python
from dncil.cil.body import reader
from dncil.cil.error import MethodBodyFormatError

def disasm(code):
    code_size = code[0]
    format_size = (len(code) - 1 << 2) | 0x2
    mod_code = [format_size] + code[1:]
    try:
        dn_body = reader.read_method_body_from_bytes(bytes(mod_code))
    except MethodBodyFormatError as e:
        print(e)
        return

    for insn in dn_body.instructions:
        print(insn)

dn = [0x0E,0x00,0x74,0x02,0x00,0x00,0x02,0x6F,0x03,0x00,0x00,0x06,0x2A]

disasm(dn)
```

```
➜  scripts python3 disasm.py
0001    00                  nop
0002    74 02 00 00 02      castclass      token(0x02000002)
0007    6f 03 00 00 06      callvirt       token(0x06000003)
000C    2a                  ret
```

In this context, through array4 construction, we can see that `callvirt` is calling `get_Text()` and `castclass` is `System.Windows.Forms.Control`. So we can conclude that the function is resolving function, argument, and type then creating a `dynamic method` for it. But If we take a look on another function, we can see also that that there is a function that doesn't need to create a dynamic method but just doing a delegation by calling following code `fieldFromHandle.SetValue(null, Delegate.CreateDelegate(fieldType, (MethodInfo)methodBase));`. Until this step, we can get several functions that we can use to dump the actual behavior of the program, such as following

* System.Reflection.Module.ResolveMethod
  * returned data is a function that probably a function that will be delegated to obfuscated function
* System.Reflection.FieldInfo.GetFieldFromHandle
  * argument can be used to derive fieldInfo which is useful to trace modified function
* System.Reflection.FieldInfo.SetValue
  * last step of reflection, setting field's value
* System.Reflection.Emit.DynamicILInfo.SetCode
  * the first argument is the bytecode of the newly created dynamic method

With this information, now we can create automation to dump information needed to understand the actual flow. Previously i've been facing an issue with automation in C# reverse engineering because of `dnSpy` limitation, so i choose to use [Harmony](https://github.com/pardeike/Harmony) to do the automation part.

{% code title="Injector.exe" %}

```csharp
using System;
using System.IO;
using EasyHook;

namespace Injector
{
    internal static class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 2)
            {
                Console.WriteLine("Usage: Injector.exe <PID> <FullPathToHookLibrary.dll>");
                return;
            }

            int pid = int.Parse(args[0]);
            string lib = Path.GetFullPath(args[1]);

            try
            {
                Console.WriteLine($"[*] Injecting {lib} into PID {pid}...");
                RemoteHooking.Inject(
                    pid,
                    InjectionOptions.Default,
                    lib,
                    lib,
                    new object[] { "" }
                );
                Console.WriteLine("[+] Injected. Check your log file.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("[-] Injection failed: " + ex);
            }
        }
    }
}

```

{% endcode %}

{% code title="TracerLib.dll" %}

```csharp
using EasyHook;
using HarmonyLib;
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;
using System.Runtime.InteropServices;
using System.Threading;


namespace HookLibrary
{
    public class EntryPoint : IEntryPoint
    {
        private static readonly string LogPath =
            @"C:\Users\Intel NUC\ctf\securinets\code\log.txt";

        public EntryPoint(RemoteHooking.IContext ctx, string _)
        {
            try { InstallHooks(); } catch (Exception ex) { Log("InstallHooks EX:\r\n" + ex); }
        }

        public void Run(RemoteHooking.IContext ctx, string _)
        {
            try { while (true) Thread.Sleep(1000); } catch { }
        }

        private void InstallHooks()
        {
            var h = new Harmony("inject.multiple.hooks");

            TryPatch(h,
                AccessTools.DeclaredMethod(typeof(Module), "ResolveMethod", new[] { typeof(int) }),
                postfix: AccessTools.DeclaredMethod(typeof(EntryPoint), nameof(Post_ResolveMethod)),
                finalizer: AccessTools.DeclaredMethod(typeof(EntryPoint), nameof(Fin_ResolveMethod)));

            TryPatch(h,
                AccessTools.DeclaredMethod(typeof(FieldInfo), "GetFieldFromHandle", new[] { typeof(RuntimeFieldHandle) }),
                postfix: AccessTools.DeclaredMethod(typeof(EntryPoint), nameof(Post_GetFieldFromHandle)));

            TryPatch(h,
                AccessTools.DeclaredMethod(typeof(FieldInfo), "SetValue", new[] { typeof(object), typeof(object) }),
                prefix: AccessTools.DeclaredMethod(typeof(EntryPoint), nameof(Pre_Field_SetValue)));

            TryPatch(h,
                AccessTools.DeclaredMethod(typeof(DynamicILInfo), "SetCode", new[] { typeof(byte[]), typeof(int) }),
                postfix: AccessTools.DeclaredMethod(typeof(EntryPoint), nameof(Post_SetCode)));

            Log("[+] Hooks installed");
        }

        private static string TypeDisplayName(Type t)
        {
            if (t == null) return "<null>";
            if (t.IsByRef) return TypeDisplayName(t.GetElementType()) + "&";
            if (t.IsPointer) return TypeDisplayName(t.GetElementType()) + "*";
            if (t.IsArray)
            {
                var elem = t.GetElementType();
                int rank = t.GetArrayRank();
                string commas = rank > 1 ? new string(',', rank - 1) : "";
                return TypeDisplayName(elem) + "[" + commas + "]";
            }
            if (t.IsGenericType)
            {
                var def = t.GetGenericTypeDefinition();
                string name = def.FullName ?? def.Name;
                int backtick = name.IndexOf('`');
                if (backtick >= 0) name = name.Substring(0, backtick);
                var args = t.GetGenericArguments();
                string inner = "";
                for (int i = 0; i < args.Length; i++)
                {
                    if (i > 0) inner += ", ";
                    inner += TypeDisplayName(args[i]);
                }
                return name + "<" + inner + ">";
            }
            return t.FullName ?? t.Name;
        }

        private static string MethodSignature(MethodBase m)
        {
            if (m == null) return "<null>";
            string ret;
            var mi = m as MethodInfo;
            ret = mi != null ? TypeDisplayName(mi.ReturnType) : "Void";

            string name = m.Name;
            
            var ps = m.GetParameters();
            string parms = "";
            for (int i = 0; i < ps.Length; i++)
            {
                if (i > 0) parms += ", ";
                var pt = ps[i].ParameterType;
                bool byref = pt.IsByRef;
                if (byref) pt = pt.GetElementType();
                parms += TypeDisplayName(pt);
            }

            return ret + " " + name + "(" + parms + ")";
        }

        private static void Post_SetCode(DynamicILInfo __instance, byte[] code, int maxStackSize)
        {
                int len = (code == null) ? 0 : code.Length;
                string preview = (len > 0) ? ToHexFast(code, len < 64 ? len : 64) : "(null)";
                Log($"[SetCode] len={len}, maxStack={maxStackSize}, hexcode={preview}");
        }

        private static void Post_ResolveMethod(Module __instance, int metadataToken, ref MethodBase __result)
        {
            Log($"[ResolveMethod] token=0x{metadataToken:X8}, result={__result}");
        }

        private static Exception Fin_ResolveMethod(Module __instance, int metadataToken, Exception __exception)
        {
            if (__exception != null)
                Log($"[ResolveMethod-EX] token=0x{metadataToken:X8}, ex={__exception.GetType().Name}: {__exception.Message}");
            return null;
        }

    
        private static void Post_GetFieldFromHandle(RuntimeFieldHandle handle, ref FieldInfo __result)
        {
            Log($"[GetFieldFromHandle] result={FmtField(__result)}");
        }

        private static void Pre_Field_SetValue(FieldInfo __instance, object obj, object value)
        {
            string val;
            var d = value as Delegate;
            if (d != null)
            {
                val = MethodSignature(d.Method);
            }
            else if (value is byte[])
            {
                var bb = (byte[])value;
                val = "byte[" + bb.Length + "]";
            }
            else if (value == null)
            {
                val = "null";
            }
            else
            {
                try { val = TypeDisplayName(value.GetType()) + ": " + value.ToString(); }
                catch { val = TypeDisplayName(value.GetType()) + ": <ToString() threw>"; }
            }

            Log("[Field.SetValue] field=" + FmtField(__instance) +
                ", target=" + (obj == null ? "<static>" : SafeToString(obj.GetType())) +
                ", value=" + val);
        }

        private static readonly System.Collections.Generic.HashSet<string> _seen =
            new System.Collections.Generic.HashSet<string>(StringComparer.Ordinal);

        private static void TryPatch(Harmony h, MethodBase target, MethodInfo prefix = null, MethodInfo postfix = null, MethodInfo finalizer = null)
        {
            try
            {
                if (target == null) { Log("[-] target method not found; skipping"); return; }

                var key = $"{target.Module.ScopeName}|0x{target.MetadataToken:X8}";
                if (!_seen.Add(key))
                {
                    Log($"[=] Already attempted: {FmtSig(target)}");
                    return;
                }
                var info = Harmony.GetPatchInfo(target);
                if (info?.Owners?.Contains(h.Id) == true)
                {
                    Log($"[=] Already patched: {FmtSig(target)}");
                    return;
                }

                h.Patch(target,
                        prefix != null ? new HarmonyMethod(prefix) : null,
                        postfix != null ? new HarmonyMethod(postfix) : null,
                        transpiler: null,
                        finalizer != null ? new HarmonyMethod(finalizer) : null);

                Log("[+] Patched: " + FmtSig(target));
            }
            catch (Exception ex)
            {
                Log("[-] Patch failed for " + FmtSig(target) + ":\r\n" + ex);
            }
        }

        private static string FmtField(FieldInfo fi) =>
            fi == null ? "null" : $"{fi.DeclaringType?.FullName}.{fi.Name} ({fi.FieldType?.FullName})";

        private static string FmtSig(MethodBase m)
        {
            var pars = m.GetParameters();
            var ps = string.Join(", ", pars.Select(p =>
                (p.ParameterType.IsByRef ? p.ParameterType.GetElementType().FullName + " ByRef" : p.ParameterType.FullName)));
            var ret = (m as MethodInfo)?.ReturnType.FullName ?? "Void";
            return $"{m.DeclaringType.FullName}::{m.Name}({ps}) -> {ret}";
        }

        private static string SafeToString(object o) { try { return o.ToString(); } catch { return "<ToString() threw>"; } }

        private static string ToHexFast(byte[] data, int count)
        {
            if (data == null || count <= 0) return "(null)";
            int n = count;
            if (data.Length < n) n = data.Length;

            char[] chars = new char[n * 2];
            const string HEX = "0123456789ABCDEF";
            for (int i = 0; i < n; i++)
            {
                byte b = data[i];
                chars[(i << 1)] = HEX[(b >> 4) & 0xF];
                chars[(i << 1) + 1] = HEX[b & 0xF];
            }
            return new string(chars);
        }


        private static void Log(string s)
        {
            try { File.AppendAllText(LogPath, $"{s}\r\n"); } catch { }
        }
    }
}
```

{% endcode %}

Next, debug the program with dnSpy then do the same action (change enabled to True). After that detach the program then run the `injector`.

```
.\Injector.exe 3544 "C:\Users\Intel NUC\ctf\securinets\code\deobfs\TracerLib\obj\Debug\TracerLib.dll"
```

Click TEST then we'll get following dump in log.txt.&#x20;

```
[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.²§/· (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000AC, result=System.String FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.²§/· (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.String FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.h
ÜL (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000AE, result=System.String FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNQAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNQAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.h
ÜL (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNZBFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.String FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNQAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNQAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.àÛ{L (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000043, result=System.String[] Split(System.String, System.String, Int32, Microsoft.VisualBasic.CompareMethod)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.àÛ{L (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.String[] Split(System.String, System.String, System.Int32, Microsoft.VisualBasic.CompareMethod)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.1oÂ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000D0, result=System.String[] FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.String, Int32, Microsoft.VisualBasic.CompareMethod)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.1oÂ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNccFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.String[] FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.String, System.Int32, Microsoft.VisualBasic.CompareMethod)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.C' (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000044, result=Boolean IsNullOrEmpty(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.C' (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Boolean IsNullOrEmpty(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.?3á3 (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000D1, result=Boolean FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.?3á3 (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Boolean FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.ÓLr¢¸ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000041, result=System.Text.StringBuilder Append(Char)
[SetCode] len=20, maxStack=3, hexcode=0E0074020000020E0100000000006F030000062A
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.ÓLr¢¸ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Object (System.Object, System.Char)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.Äf/C (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000CD, result=System.Object FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.Object, Char)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.Äf/C (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNBcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Object FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.Object, System.Char)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.UüÉ®Ë (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000046, result=Char Chr(Int32)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.UüÉ®Ë (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Char Chr(System.Int32)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.=ò¨, (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000040, result=Char ChrW(Int32)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.=ò¨, (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Char ChrW(System.Int32)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.\û^¯ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000D3, result=Char FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNebFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNebFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(Int32)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.\û^¯ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Char FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNebFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNebFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.Int32)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.ã?*D (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000CC, result=Char FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(Int32)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.ã?*D (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNbcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Char FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.Int32)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.íñãx (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000045, result=Int32 ToInt32(System.String, Int32)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.íñãx (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Int32 ToInt32(System.String, System.Int32)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.#ñFf (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000D2, result=Int32 FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNDbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNDbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, Int32)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.#ñFf (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Int32 FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNDbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNDbFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.Int32)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.|w:ý (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000028, result=Boolean Equals(System.String, System.String, System.StringComparison)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.|w:ý (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Boolean Equals(System.String, System.String, System.StringComparison)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.}Ôéaò (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000B3, result=Boolean FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNtAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNtAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.String, System.StringComparison)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.}Ôéaò (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN0BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Boolean FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNtAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNtAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.String, System.StringComparison)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.¹>VM (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A00003E, result=Int32 AscW(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.¹>VM (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Int32 AscW(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.f¸ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A00003C, result=Int32 Len(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.f¸ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Int32 Len(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.:û 
Å (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000CA, result=Int32 FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.:û 
Å (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Int32 FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.Hõ"}g (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000C8, result=Int32 FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.Hõ"}g (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Int32 FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.°æRÒ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A00003D, result=System.String Mid(System.String, Int32, Int32)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.°æRÒ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.String Mid(System.String, System.Int32, System.Int32)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.Õlá% (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000C9, result=System.String FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN8AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN8AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, Int32, Int32)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.Õlá% (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNacFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.String FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN8AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN8AFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.Int32, System.Int32)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.>C¦Ã (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A00003F, result=Void .ctor(Int32)
[SetCode] len=13, maxStack=2, hexcode=0E00000000000073020000062A
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.>C¦Ã (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Object (System.Int32)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.F·=n (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000CB, result=System.Object FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNabFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNabFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(Int32)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.F·=n (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNAcFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Object FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNabFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNabFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.Int32)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.nôÕ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A00002A, result=Void WriteLine(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.nôÕ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Void WriteLine(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.ëbAÏ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000B5, result=Void FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNuAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNuAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.ëbAÏ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Void FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNuAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNuAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.O8ô4) (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000006, result=Void FailFast(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.O8ô4) (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Void FailFast(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.øì& (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000006, result=Void FailFast(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.øì& (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Void FailFast(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.	¯Oê (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000006, result=Void FailFast(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.	¯Oê (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN9bFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Void FailFast(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.ëbO (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A000029, result=System.Windows.Forms.DialogResult Show(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.ëbO (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Windows.Forms.DialogResult Show(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.	éAo, (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000B4, result=System.Windows.Forms.DialogResult FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNTAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNTAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.	éAo, (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN5BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Windows.Forms.DialogResult FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNTAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNTAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.¨xÞ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A00002C, result=Int32 CompareString(System.String, System.String, Boolean)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.¨xÞ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Int32 CompareString(System.String, System.String, System.Boolean)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.¼yïõ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000B7, result=Int32 FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNvAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNvAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.String, Boolean)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.¼yïõ (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN6BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Int32 FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNvAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNvAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.String, System.Boolean)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.CDuJ0 (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x0A00002D, result=System.Windows.Forms.DialogResult Show(System.String, System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.CDuJ0 (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Windows.Forms.DialogResult Show(System.String, System.String)

[GetFieldFromHandle] result=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.g;íC (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN)
[ResolveMethod] token=0x060000B8, result=System.Windows.Forms.DialogResult FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNVAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNVAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.String)
[Field.SetValue] field=FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN.g;íC (FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN7BFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN), target=<static>, value=System.Windows.Forms.DialogResult FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNVAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNVAFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.String)
```

Now, we've several option to continue the analysis, we can setup breakpoint on imported functions or we can setup breakpoint on the known obfuscated function. But since setting up breakpoint using dnSpy on obfuscated function make it failed to detect the local variables so i decided to setup breakpoint on imported functions. Filter the imported functions and we can see list of functions such as following

```
[ResolveMethod] token=0x0A000043, result=System.String[] Split(System.String, System.String, Int32, Microsoft.VisualBasic.CompareMethod)
[ResolveMethod] token=0x0A000044, result=Boolean IsNullOrEmpty(System.String)
[ResolveMethod] token=0x0A000041, result=System.Text.StringBuilder Append(Char)
[ResolveMethod] token=0x0A000046, result=Char Chr(Int32)
[ResolveMethod] token=0x0A000040, result=Char ChrW(Int32)
[ResolveMethod] token=0x0A000045, result=Int32 ToInt32(System.String, Int32)
[ResolveMethod] token=0x0A000028, result=Boolean Equals(System.String, System.String, System.StringComparison)
[ResolveMethod] token=0x0A00003E, result=Int32 AscW(System.String)
[ResolveMethod] token=0x0A00003C, result=Int32 Len(System.String)
[ResolveMethod] token=0x0A00003D, result=System.String Mid(System.String, Int32, Int32)
[ResolveMethod] token=0x0A00003F, result=Void .ctor(Int32)
[ResolveMethod] token=0x0A00002A, result=Void WriteLine(System.String)
[ResolveMethod] token=0x0A000006, result=Void FailFast(System.String)
[ResolveMethod] token=0x0A000006, result=Void FailFast(System.String)
[ResolveMethod] token=0x0A000006, result=Void FailFast(System.String)
[ResolveMethod] token=0x0A000029, result=System.Windows.Forms.DialogResult Show(System.String)
[ResolveMethod] token=0x0A00002C, result=Int32 CompareString(System.String, System.String, Boolean)
[ResolveMethod] token=0x0A00002D, result=System.Windows.Forms.DialogResult Show(System.String, System.String)
```

Set up breakpoint on several imported function above

```
0x06000FE4 bool Control.Enabled.set + 0x0000		(no condition)	break always (currently 1)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_MSIL\System.Windows.Forms\v4.0_4.0.0.0__b77a5c561934e089\System.Windows.Forms.dll
0x06000CD0 int Convert.ToInt32(string value, int fromBase) + 0x0000		(no condition)	break always (currently 0)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_32\mscorlib\v4.0_4.0.0.0__b77a5c561934e089\mscorlib.dll
0x0600016B char Strings.ChrW(int CharCode) + 0x0000		(no condition)	break always (currently 0)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_MSIL\Microsoft.VisualBasic\v4.0_10.0.0.0__b03f5f7f11d50a3a\Microsoft.VisualBasic.dll
0x0600016A char Strings.Chr(int CharCode) + 0x00D1		(no condition)	break always (currently 0)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_MSIL\Microsoft.VisualBasic\v4.0_10.0.0.0__b03f5f7f11d50a3a\Microsoft.VisualBasic.dll
0x06000168 int Strings.AscW(string String) + 0x0000		(no condition)	break always (currently 0)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_MSIL\Microsoft.VisualBasic\v4.0_10.0.0.0__b03f5f7f11d50a3a\Microsoft.VisualBasic.dll
0x060001A2 string Strings.Mid(string str, int Start, int Length) + 0x0000		(no condition)	break always (currently 0)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_MSIL\Microsoft.VisualBasic\v4.0_10.0.0.0__b03f5f7f11d50a3a\Microsoft.VisualBasic.dll
0x06000185 int Strings.Len(string Expression) + 0x000E		(no condition)	break always (currently 2)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_MSIL\Microsoft.VisualBasic\v4.0_10.0.0.0__b03f5f7f11d50a3a\Microsoft.VisualBasic.dll
0x06000B7B void Console.WriteLine(string value) + 0x0000		(no condition)	break always (currently 0)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_32\mscorlib\v4.0_4.0.0.0__b77a5c561934e089\mscorlib.dll
0x060004C5 bool string.Equals(string a, string b, StringComparison comparisonType) + 0x0000		(no condition)	break always (currently 0)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_32\mscorlib\v4.0_4.0.0.0__b77a5c561934e089\mscorlib.dll
0x0600018A string[] Strings.Split(string Expression, [string Delimiter], [int Limit], [CompareMethod Compare]) + 0x0000		(no condition)	break always (currently 1)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_MSIL\Microsoft.VisualBasic\v4.0_10.0.0.0__b03f5f7f11d50a3a\Microsoft.VisualBasic.dll
0x06006700 StringBuilder StringBuilder.Append(char value) + 0x0000		(no condition)	break always (currently 0)	(none)	Break	C:\WINDOWS\Microsoft.NET\assembly\GAC_32\mscorlib\v4.0_4.0.0.0__b77a5c561934e089\mscorlib.dll
```

When the breakpoint hits, looking at the call stack, we can see several native functions that will make dnSpy crash if we double click on it (or trying to decompile it using dnSpy). So let's dump those native function and decompile it using IDA.

```python
def write_bin(fn, data):
	out = open(fn, "wb")
	out.write(data)

# FUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTNAFUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTNAFUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTN.FUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTNbFUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTNbFUCKED_BY_AD3M_XTN\u1160\u1160\u1160\u1160\u1160FUCKED_BY_AD3M_XTN
a = bytes.fromhex("558BEC575681EC480700008BF18DBDB0F8FFFFB9D101000033C0F3AB8BCE898D4CF9FFFF8955F4833D6443C800007405E80B06A75733D2899520FFFFFFB8A47601008D805C89FEFF898520FFFFFF90E9461A0000908B8520FFFFFFBA45D700008D92BC28FFFF3BC2751F8B0DA826BE038B410C8B4904FFD0B84B3E01008D80B7C1FEFF898520FFFFFF908B8520FFFFFFBA081400008D92FAEBFFFF3BC20F85BB0D000090B91847C800BA41000000E84D276FF6A17828BE038985FCF8FFFF8B05105581048985F8F8FFFFDD05182C580ADD9DECFBFFFFDD05202C580A83EC08DD1C24E8D92CCF57DD9DE4FBFFFFDD85ECFBFFFFDC85E4FBFFFF83EC08DD1C24E8EC2BD1FA8985E0FBFFFF908B85E0FBFFFF408985DCFBFFFF8B05305881048945848B15345881048B4D84E86143C9FA8985D8FBFFFF8B85FCF8FFFF8985D4FBFFFF8B85F8F8FFFF8985D0FBFFFF8B85DCFBFFFF8985CCFBFFFF83BDD8FBFFFF0075308B85D4FBFFFF8985C8FBFFFF8B85D0FBFFFF8985C4FBFFFF8B85CCFBFFFF8985C0FBFFFFC785BCFBFFFFA84C3139EB2E8B85D4FBFFFF8985C8FBFFFF8B85D0FBFFFF8985C4FBFFFF8B85CCFBFFFF8985C0FBFFFFC785BCFBFFFFA94C31398B85BCFBFFFF8945808B053858810489857CFFFFFFC785B8FBFFFFA84C31398B15385881048B8D7CFFFFFFE8A042C9FA8985B4FBFFFF8B85C8FBFFFF8985B0FBFFFF8B85C4FBFFFF8985ACFBFFFF8B85C0FBFFFF8985A8FBFFFF8B85B8FBFFFF8985A4FBFFFF83BDB4FBFFFF00753C8B85B0FBFFFF8985A0FBFFFF8B85ACFBFFFF89859CFBFFFF8B85A8FBFFFF898598FBFFFF8B85A4FBFFFF898594FBFFFFC78590FBFFFF174C3139EB3A8B85B0FBFFFF8985A0FBFFFF8B85ACFBFFFF89859CFBFFFF8B85A8FBFFFF898598FBFFFF8B85A4FBFFFF898594FBFFFFC78590FBFFFF164C31398B8590FBFFFF898578FFFFFF908B8598FBFFFF8B9594FBFFFFB9164C313933D103C289858CFBFFFFDD05282C580ADD9D84FBFFFFDD05302C580A83EC08DD1C24E8F6EE7657DD9D7CFBFFFFDD8584FBFFFFDC857CFBFFFF83EC08DD1C24E8E929D1FA898578FBFFFF908B8578FBFFFF83C0F0898574FBFFFFD905382C580AD835402C580A83EC08DD1C24E8BC29D1FA898570FBFFFF908B8574FBFFFF038570FBFFFF89856CFBFFFFDD05482C580ADD9D64FBFFFFDD05502C580A83EC08DD1C24E8C62ACF57DD9D5CFBFFFFDD8564FBFFFFDCA55CFBFFFF83EC08DD1C24E86929D1FA898558FBFFFF908B8558FBFFFF83C008898554FBFFFFD905582C580ADD9D4CFBFFFFDD05602C580A83EC08DD1C24E8462ACF57DD9D44FBFFFFDD854CFBFFFFDCA544FBFFFF83EC08DD1C24E81929D1FA898540FBFFFFFFB56CFBFFFF8B8554FBFFFF038540FBFFFF5068A8CB72088B8D9CFBFFFF8B958CFBFFFFE80A8982FE8985F4F8FFFF8B85F4F8FFFF8945E48B8DA0FBFFFF8B55E48B410C8B4904FFD08985F0F8FFFF8B85F0F8FFFF8D155C26BE03E863107457A14028BE038985ECF8FFFF8B0D9827BE038B410C8B4904FFD08985E8F8FFFF8B0D2428BE038B155C26BE038B410C8B4904FFD08985E4F8FFFFFFB5E4F8FFFF8B8DECF8FFFF8B95E8F8FFFF8B410C8B4904FFD08985E0F8FFFF8B85E0F8FFFF8D156026BE03E8F90F745790B91847C800BA42000000E849236FF6A18028BE038985DCF8FFFFA1F426BE038985D8F8FFFF8B05105581048985D4F8FFFFD905682C580ADC0D702C580A83EC08DD1C24E80028D1FA89853CFBFFFF908B853CFBFFFF48898538FBFFFFD905782C580AD80D802C580A83EC08DD1C24E8D527D1FA898534FBFFFF908B8538FBFFFF2B8534FBFFFF898530FBFFFFDD05882C580ADC05902C580A83EC08DD1C24E8A527D1FA89852CFBFFFF908B852CFBFFFF40898528FBFFFFD905982C580ADD9D20FBFFFFDD05A02C580A83EC08DD1C24E8E428CF57DD9D18FBFFFFDD8520FBFFFFDCA518FBFFFF83EC08DD1C24E85727D1FA898514FBFFFF908B8528FBFFFF038514FBFFFF898510FBFFFFD905A82C580ADD9D08FBFFFFDD05B02C580A83EC08DD1C24E89128CF57DD9D00FBFFFFDD8508FBFFFFDC8500FBFFFF83EC08DD1C24E80427D1FA8985FCFAFFFF908B85FCFAFFFF408985F8FAFFFFD905B82C580ADD9DF0FAFFFFDD05C02C580A83EC08DD1C24E8E327CF57DD9DE8FAFFFFDD85F0FAFFFFDCA5E8FAFFFFDD9DE0FAFFFFDD85E0FAFFFF83EC08DD1C24E8AA26D1FA8985DCFAFFFFFFB510FBFFFF8B85F8FAFFFF2B85DCFAFFFF5068A8CB72088B8DD4F8FFFF8B9530FBFFFFE89B8682FE8985D0F8FFFF8B85D0F8FFFF8945DCFF356026BE038B8DD8F8FFFF8B55DC8B410C8B4904FFD08985CCF8FFFF908B05105581048985C8F8FFFFDD05C82C580AD835D02C580A83EC08DD1C24E82B26D1FA8985D8FAFFFF908B85D8FAFFFF48488985D4FAFFFFD905D82C580ADD9DCCFAFFFFDD05E02C580A83EC08DD1C24E84926CF57DD9DC4FAFFFFDD85CCFAFFFFDCA5C4FAFFFF83EC08DD1C24E8DC25D1FA8985C0FAFFFF908B85D4FAFFFF0385C0FAFFFF8985BCFAFFFF8B053C588104898574FFFFFF8B15405881048B8D74FFFFFFE8463DC9FA8985B8FAFFFF8B85DCF8FFFF8985B4FAFFFF8B85CCF8FFFF8985B0FAFFFF8B85C8F8FFFF8985ACFAFFFF8B85BCFAFFFF8985A8FAFFFF83BDB8FAFFFF00753C8B85B4FAFFFF8985A4FAFFFF8B85B0FAFFFF8985A0FAFFFF8B85ACFAFFFF89859CFAFFFF8B85A8FAFFFF898598FAFFFFC78594FAFFFF6E311E99EB3A8B85B4FAFFFF8985A4FAFFFF8B85B0FAFFFF8985A0FAFFFF8B85ACFAFFFF89859CFAFFFF8B85A8FAFFFF898598FAFFFFC78594FAFFFF6F311E998B8594FAFFFF898570FFFFFF8B054458810489856CFFFFFFC78590FAFFFF6E311E998B15485881048B8D6CFFFFFFE85E3CC9FA89858CFAFFFF8B85A4FAFFFF898588FAFFFF8B85A0FAFFFF898584FAFFFF8B859CFAFFFF898580FAFFFF8B8598FAFFFF89857CFAFFFF8B8590FAFFFF898578FAFFFF83BD8CFAFFFF0075488B8588FAFFFF898574FAFFFF8B8584FAFFFF898570FAFFFF8B8580FAFFFF89856CFAFFFF8B857CFAFFFF898568FAFFFF8B8578FAFFFF898564FAFFFFC78560FAFFFFF0823466EB468B8588FAFFFF898574FAFFFF8B8584FAFFFF898570FAFFFF8B8580FAFFFF89856CFAFFFF8B857CFAFFFF898568FAFFFF8B8578FAFFFF898564FAFFFFC78560FAFFFFF18234668B8560FAFFFF898568FFFFFF908B8564FAFFFFBAF082346633C24089855CFAFFFFD905E82C580ADD9D54FAFFFFDD05F02C580A83EC08DD1C24E8F723CF57DD9D4CFAFFFFDD8554FAFFFFDC854CFAFFFF83EC08DD1C24E88A23D1FA898548FAFFFF908B855CFAFFFF038548FAFFFF898544FAFFFFDD05F82C580ADD9D3CFAFFFFDD05002D580A83EC08DD1C24E84423CF57DD9D34FAFFFFDD853CFAFFFFDCA534FAFFFF83EC08DD1C24E83723D1FA898530FAFFFF908B8530FAFFFF404089852CFAFFFFD905082D580AD825102D580A83EC08DD1C24E80B23D1FA898528FAFFFFFFB544FAFFFF8B852CFAFFFF2B8528FAFFFF50681CCD72088B8D6CFAFFFF8B9568FAFFFFE81C438CFE8985C4F8FFFF8B85C4F8FFFF8945D48B45D48D156426BE03E86F0A745790A16426BE038985C0F8FFFFD905142D580AD805182D580A83EC08DD1C24E89C22D1FA898524FAFFFF908B8524FAFFFF40898520FAFFFFDD05202D580ADD9D18FAFFFFDD05282D580A83EC08DD1C24E82B23CF57DD9D10FAFFFFDD8518FAFFFFDC8510FAFFFF83EC08DD1C24E84E22D1FA89850CFAFFFF8B8520FAFFFF2B850CFAFFFF8945CCFFB5C0F8FFFFFF75CC8B8D74FAFFFF8B9570FAFFFF8B410C8B4904FFD0898508FAFFFF83BD08FAFFFF000F849103000090B91847C800BA44000000E8091D6FF6A18828BE038985BCF8FFFF8B05105581048985B8F8FFFF8B054C588104898564FFFFFF8B154C5881048B8D64FFFFFFE86539C9FA898504FAFFFF8B85BCF8FFFF898500FAFFFF8B85B8F8FFFF8985FCF9FFFF83BD04FAFFFF0075248B8500FAFFFF8985F8F9FFFF8B85FCF9FFFF8985F4F9FFFFC785F0F9FFFF4EFC7D26EB228B8500FAFFFF8985F8F9FFFF8B85FCF9FFFF8985F4F9FFFFC785F0F9FFFF4DFC7D268B85F0F9FFFF898560FFFFFF8B055058810489855CFFFFFFC785ECF9FFFF4DFC7D268B15505881048B8D5CFFFFFFE8C538C9FA8985E8F9FFFF8B85F8F9FFFF8985E4F9FFFF8B85F4F9FFFF8985E0F9FFFF8B85ECF9FFFF8985DCF9FFFF83BDE8F9FFFF0075308B85E4F9FFFF8985D8F9FFFF8B85E0F9FFFF8985D4F9FFFF8B85DCF9FFFF8985D0F9FFFFC785CCF9FFFF80F83C57EB2E8B85E4F9FFFF8985D8F9FFFF8B85E0F9FFFF8985D4F9FFFF8B85DCF9FFFF8985D0F9FFFFC785CCF9FFFF7FF83C578B85CCF9FFFF898558FFFFFF908B85D0F9FFFFBA7FF83C5733C283C0048985C8F9FFFFDD05302D580ADD9DC0F9FFFFDD05382D580A83EC08DD1C24E82421CF57DD9DB8F9FFFFDD85C0F9FFFFDC85B8F9FFFF83EC08DD1C24E83720D1FA8985B4F9FFFF908B85C8F9FFFF2B85B4F9FFFF8985B0F9FFFFDD05402D580ADD9DA8F9FFFFDD05482D580A83EC08DD1C24E8B9E2D1FADD9DA0F9FFFFDD85A8F9FFFFDCA5A0F9FFFF83EC08DD1C24E8E41FD1FA89859CF9FFFF908B859CF9FFFF83C0F8898598F9FFFFDD05502D580ADD9D90F9FFFFDD05582D580A83EC08DD1C24E8A11FCF57DD9D88F9FFFFDD8590F9FFFFDCA588F9FFFF83EC08DD1C24E8941FD1FA898584F9FFFF908B8598F9FFFF2B8584F9FFFF898580F9FFFFD905602D580ADD9D78F9FFFFDD05682D580A83EC08DD1C24E8AE1FCF57DD9D70F9FFFFDD8578F9FFFFDC8570F9FFFF83EC08DD1C24E8411FD1FA89856CF9FFFF908B856CF9FFFF4848898568F9FFFFDD05702D580ADD9D60F9FFFFDD05782D580A83EC08DD1C24E8CF1FCF57DD9D58F9FFFFDD8560F9FFFFDC8558F9FFFF83EC08DD1C24E8F21ED1FA898554F9FFFFFFB580F9FFFF8B8568F9FFFF038554F9FFFF506898CD72088B8DD4F9FFFF8B95B0F9FFFFE8D3498CFE8985B4F8FFFF8B85B4F8FFFF8945C48B8DD8F9FFFF8B55C48B410C8B4904FFD0898550F9FFFF90908D65F85E5F5DC20400908B8520FFFFFFBA2F5800008D92D4A7FFFF3BC20F85E10B000090B91847C800BA25000000E878196FF6A11027BE03898530F9FFFF8B051055810489852CF9FFFFDD05802D580ADD9D24FEFFFFDD05882D580A83EC08DD1C24E8141FCF57DD9D1CFEFFFFDD8524FEFFFFDC851CFEFFFF83EC08DD1C24E8171ED1FA898518FEFFFF908B8518FEFFFF48898514FEFFFFD905902D580ADD9D0CFEFFFFDD05982D580A83EC08DD1C24E8561FCF57DD9D04FEFFFFDD850CFEFFFFDC8504FEFFFF83EC08DD1C24E8C91DD1FA898500FEFFFF908B8514FEFFFF2B8500FEFFFF8985FCFDFFFFDD05A02D580ADC35A82D580A83EC08DD1C24E8991DD1FA8985F8FDFFFF908B85F8FDFFFF83C0F88985F4FDFFFFD905B02D580ADD9DECFDFFFFDD05B82D580A83EC08DD1C24E896E17657DD9DE4FDFFFFDD85ECFDFFFFDC85E4FDFFFF83EC08DD1C24E8491DD1FA8985E0FDFFFF908B85F4FDFFFF2B85E0FDFFFF8985DCFDFFFFD905C02D580ADD9DD4FDFFFFDD05C82D580A83EC08DD1C24E803E27657DD9DCCFDFFFFDD85D4FDFFFFDCA5CCFDFFFF83EC08DD1C24E8F61CD1FA8985C8FDFFFF908B85C8FDFFFF83C0048985C4FDFFFFD905D02D580AD80DD82D580A83EC08DD1C24E8C91CD1FA8985C0FDFFFF8B85C4FDFFFF2B85C0FDFFFF8985BCFDFFFFFFB5DCFDFFFFFFB5BCFDFFFF68A8CB72088B8D2CF9FFFF8B95FCFDFFFFE8AF7C82FE898528F9FFFF8B8528F9FFFF8945BC8B8D30F9FFFF8B55BC8B410C8B4904FFD090B91847C800BA44000000E86F176FF6A18828BE03898524F9FFFF8B0510558104898520F9FFFFDD05E02D580ADC25E82D580A83EC08DD1C24E8311CD1FA8985B8FDFFFF908B85B8FDFFFF83C0048985B4FDFFFFDD05F02D580ADD9DACFDFFFFDD05F82D580A83EC08DD1C24E8BE1CCF57DD9DA4FDFFFFDD85ACFDFFFFDC85A4FDFFFF83EC08DD1C24E8E11BD1FA8985A0FDFFFF908B85B4FDFFFF2B85A0FDFFFF89859CFDFFFFDD05002E580ADC25082E580A83EC08DD1C24E8B11BD1FA898598FDFFFF908B8598FDFFFF03C0898594FDFFFFD905102E580ADD9D8CFDFFFFDD05182E580A83EC08DD1C24E88F1CCF57DD9D84FDFFFFDD858CFDFFFFDC8584FDFFFF83EC08DD1C24E8621BD1FA898580FDFFFF908B8580FDFFFF4889857CFDFFFFDD05202E580ADD9D74FDFFFFDD05282E580A83EC08DD1C24E8F11BCF57DD9D6CFDFFFFDD8574FDFFFFDC856CFDFFFF83EC08DD1C24E8141BD1FA898568FDFFFFFFB594FDFFFF8B857CFDFFFF038568FDFFFF5068A0CC72088B8D20F9FFFF8B959CFDFFFFE89D2F8CFE89851CF9FFFF8B851CF9FFFF8945B48B8D24F9FFFF8B55B48B410C8B4904FFD0898564FDFFFF90C78524FFFFFF0B989602B91847C800BA45000000E8B5156FF6A19028BE03898560FDFFFFA10428BE0389855CFDFFFF81BD24FFFFFFA56F774774268B8560FDFFFF898558FDFFFF8B855CFDFFFF898554FDFFFF8B854CF9FFFF898550FDFFFFEB2890908B8560FDFFFF898558FDFFFF8B855CFDFFFF898554FDFFFF8B854CF9FFFF898550FDFFFFEB008B8D50FDFFFFBAC80C0F08E825AC77578985B0F8FFFF8B95B0F8FFFF8B8D54FDFFFF8B410C8B4904FFD0898518F9FFFF908B0510558104898514F9FFFFDD05302E580ADC35382E580A83EC08DD1C24E8E119D1FA89854CFDFFFF908B854CFDFFFF83C004898548FDFFFFD905402E580ADD9D40FDFFFFDD05482E580A83EC08DD1C24E866DCD1FADD9D38FDFFFFDD8540FDFFFFDCA538FDFFFF83EC08DD1C24E89119D1FA898534FDFFFF908B8548FDFFFF038534FDFFFF898530FDFFFFDD05502E580ADD9D28FDFFFFDD05582E580A83EC08DD1C24E84B19CF57DD9D20FDFFFFDD8528FDFFFFDCA520FDFFFF83EC08DD1C24E83E19D1FA89851CFDFFFF908B851CFDFFFF4848898518FDFFFFD905602E580ADD9D10FDFFFFDD05682E580A83EC08DD1C24E87C1ACF57DD9D08FDFFFFDD8510FDFFFFDCA508FDFFFF83EC08DD1C24E8EF18D1FA898504FDFFFF908B8518FDFFFF038504FDFFFF898500FDFFFFD905702E580ADD9DF8FCFFFFDD05782E580A83EC08DD1C24E8E9DC7657DD9DF0FCFFFFDD85F8FCFFFFDCA5F0FCFFFF83EC08DD1C24E89C18D1FA8985ECFCFFFF908B85ECFCFFFF408985E8FCFFFFDD05802E580A83EC08DD1C24E8B719CF57DD9DE0FCFFFFDD05882E580ADD9DD8FCFFFFDD85D8FCFFFFDC85E0FCFFFF83EC08DD1C24E84E18D1FA8985D4FCFFFFFFB500FDFFFF8B85E8FCFFFF0385D4FCFFFF5068A8CB72088B8D14F9FFFF8B9530FDFFFFE83F7882FE898510F9FFFF8B8510F9FFFF8945AC908B45AC89850CF9FFFFD905902E580AD825982E580A83EC08DD1C24E8EF17D1FA8985D0FCFFFF908B85D0FCFFFF488985CCFCFFFFD9059C2E580AD835A02E580A83EC08DD1C24E8C417D1FA8985C8FCFFFF8B85CCFCFFFF0385C8FCFFFF8945A4FFB50CF9FFFFFF75A48B8D58FDFFFF8B9518F9FFFF8B410C8B4904FFD08985C4FCFFFF83BDC4FCFFFF000F852F05000090B91847C800BA44000000E87F126FF6A18828BE03898508F9FFFF8B0510558104898504F9FFFFDD05A82E580ADC05B02E580A83EC08DD1C24E84117D1FA8985C0FCFFFF908B85C0FCFFFF40408985BCFCFFFF8B0554588104898554FFFFFF8B15545881048B8D54FFFFFFE8AF2EC9FA8985B8FCFFFF8B8508F9FFFF8985B4FCFFFF8B8504F9FFFF8985B0FCFFFF8B85BCFCFFFF8985ACFCFFFF83BDB8FCFFFF0075308B85B4FCFFFF8985A8FCFFFF8B85B0FCFFFF8985A4FCFFFF8B85ACFCFFFF8985A0FCFFFFC7859CFCFFFF2A59B52FEB2E8B85B4FCFFFF8985A8FCFFFF8B85B0FCFFFF8985A4FCFFFF8B85ACFCFFFF8985A0FCFFFFC7859CFCFFFF2959B52F8B859CFCFFFF898550FFFFFF8B055858810489854CFFFFFFC78598FCFFFF2959B52F8B15585881048B8D4CFFFFFFE8EB2DC9FA898594FCFFFF8B85A8FCFFFF898590FCFFFF8B85A4FCFFFF89858CFCFFFF8B85A0FCFFFF898588FCFFFF8B8598FCFFFF898584FCFFFF83BD94FCFFFF00753C8B8590FCFFFF898580FCFFFF8B858CFCFFFF89857CFCFFFF8B8588FCFFFF898578FCFFFF8B8584FCFFFF898574FCFFFFC78570FCFFFFAD5BB52FEB3A8B8590FCFFFF898580FCFFFF8B858CFCFFFF89857CFCFFFF8B8588FCFFFF898578FCFFFF8B8584FCFFFF898574FCFFFFC78570FCFFFFAC5BB52F8B8570FCFFFF898548FFFFFF908B8578FCFFFF8B9574FCFFFFB9AC5BB52F33D12BC289856CFCFFFFDD05B82E580ADC05C02E580A83EC08DD1C24E85715D1FA898568FCFFFF908B8568FCFFFF83C010898564FCFFFF8B055C588104898544FFFFFF8B155C5881048B8D44FFFFFFE8C42CC9FA898560FCFFFF8B8580FCFFFF89855CFCFFFF8B857CFCFFFF898558FCFFFF8B856CFCFFFF898554FCFFFF8B8564FCFFFF898550FCFFFF83BD60FCFFFF00753C8B855CFCFFFF89854CFCFFFF8B8558FCFFFF898548FCFFFF8B8554FCFFFF898544FCFFFF8B8550FCFFFF898540FCFFFFC7853CFCFFFFC7E10F5DEB3A8B855CFCFFFF89854CFCFFFF8B8558FCFFFF898548FCFFFF8B8554FCFFFF898544FCFFFF8B8550FCFFFF898540FCFFFFC7853CFCFFFFC6E10F5D8B853CFCFFFF898540FFFFFF8B056058810489853CFFFFFFC78538FCFFFFC6E10F5D8B15605881048B8D3CFFFFFFE8DC2BC9FA898534FCFFFF8B854CFCFFFF898530FCFFFF8B8548FCFFFF89852CFCFFFF8B8544FCFFFF898528FCFFFF8B8540FCFFFF898524FCFFFF8B8538FCFFFF898520FCFFFF83BD34FCFFFF0075488B8530FCFFFF89851CFCFFFF8B852CFCFFFF898518FCFFFF8B8528FCFFFF898514FCFFFF8B8524FCFFFF898510FCFFFF8B8520FCFFFF89850CFCFFFFC78508FCFFFFE8E00F5DEB468B8530FCFFFF89851CFCFFFF8B852CFCFFFF898518FCFFFF8B8528FCFFFF898514FCFFFF8B8524FCFFFF898510FCFFFF8B8520FCFFFF89850CFCFFFFC78508FCFFFFE7E00F5D8B8508FCFFFF898538FFFFFF908B8510FCFFFF8B950CFCFFFFB9E7E00F5D33D103C2898504FCFFFFD905C82E580AD80DD02E580A83EC08DD1C24E82413D1FA898500FCFFFF908B8500FCFFFF83C0F88985FCFBFFFFD905D42E580AD805D82E580A83EC08DD1C24E8F712D1FA8985F8FBFFFFFFB504FCFFFF8B85FCFBFFFF0385F8FBFFFF506824CC72088B8D18FCFFFF8B9514FCFFFFE870198CFE898500F9FFFF8B8500F9FFFF89459C8B8D1CFCFFFF8B559C8B410C8B4904FFD08985F4FBFFFF90908D65F85E5F5DC20400908B8520FFFFFFBA104501008D92F0BAFEFF3BC2751290B8875D01008D807AA2FEFF898520FFFFFF908B8520FFFFFFBAAA5A00008D925AA5FFFF3BC2750390EB0690E9B4E5FFFF90B91847C800BA46000000E8500D6FF6A19828BE03898548F9FFFF8B0510558104898544F9FFFFDD05E02E580ADC35E82E580A83EC08DD1C24E81212D1FA89851CFFFFFF908B851CFFFFFF4040898518FFFFFFD905F02E580AD805F82E580A83EC08DD1C24E8E611D1FA898514FFFFFF908B8518FFFFFF038514FFFFFF898510FFFFFFDD05002F580ADD9D08FFFFFFDD05082F580A83EC08DD1C24E87012CF57DD9D00FFFFFFDD8508FFFFFFDCA500FFFFFF83EC08DD1C24E89311D1FA8985FCFEFFFF908B85FCFEFFFF83C0F08985F8FEFFFF8B0564588104898534FFFFFF8B15685881048B8D34FFFFFFE80029C9FA8985F4FEFFFF8B8548F9FFFF8985F0FEFFFF8B8544F9FFFF8985ECFEFFFF8B8510FFFFFF8985E8FEFFFF8B85F8FEFFFF8985E4FEFFFF83BDF4FEFFFF00753C8B85F0FEFFFF8985E0FEFFFF8B85ECFEFFFF8985DCFEFFFF8B85E8FEFFFF8985D8FEFFFF8B85E4FEFFFF8985D4FEFFFFC785D0FEFFFF6742636DEB3A8B85F0FEFFFF8985E0FEFFFF8B85ECFEFFFF8985DCFEFFFF8B85E8FEFFFF8985D8FEFFFF8B85E4FEFFFF8985D4FEFFFFC785D0FEFFFF6842636D8B85D0FEFFFF898530FFFFFF8B056C58810489852CFFFFFFC785CCFEFFFF6742636D8B15705881048B8D2CFFFFFFE81828C9FA8985C8FEFFFF8B85E0FEFFFF8985C4FEFFFF8B85DCFEFFFF8985C0FEFFFF8B85D8FEFFFF8985BCFEFFFF8B85D4FEFFFF8985B8FEFFFF8B85CCFEFFFF8985B4FEFFFF83BDC8FEFFFF0075488B85C4FEFFFF8985B0FEFFFF8B85C0FEFFFF8985ACFEFFFF8B85BCFEFFFF8985A8FEFFFF8B85B8FEFFFF8985A4FEFFFF8B85B4FEFFFF8985A0FEFFFFC7859CFEFFFFE241636DEB468B85C4FEFFFF8985B0FEFFFF8B85C0FEFFFF8985ACFEFFFF8B85BCFEFFFF8985A8FEFFFF8B85B8FEFFFF8985A4FEFFFF8B85B4FEFFFF8985A0FEFFFFC7859CFEFFFFE341636D8B859CFEFFFF898528FFFFFF908B85A4FEFFFF8B95A0FEFFFFB9E241636D33D12BC2898598FEFFFFD905102F580AD805182F580A83EC08DD1C24E8600FD1FA898594FEFFFF908B8594FEFFFF48898590FEFFFFD905202F580ADD9D88FEFFFFDD05282F580A83EC08DD1C24E87F0FCF57DD9D80FEFFFFDD8588FEFFFFDC8580FEFFFF83EC08DD1C24E8120FD1FA89857CFEFFFFFFB598FEFFFF8B8590FEFFFF03857CFEFFFF50681CCD72088B8DACFEFFFF8B95A8FEFFFFE8232F8CFE898540F9FFFF8B8540F9FFFF894594908B459489853CF9FFFF8B0510558104898538F9FFFFDD05302F580ADC05382F580A83EC08DD1C24E8A70ED1FA898578FEFFFF908B8578FEFFFF40898574FEFFFFD905402F580ADD9D6CFEFFFFDD05482F580A83EC08DD1C24E8860FCF57DD9D64FEFFFFDD856CFEFFFFDCA564FEFFFF83EC08DD1C24E8590ED1FA898560FEFFFF908B8574FEFFFF2B8560FEFFFF89855CFEFFFFDD05502F580ADD9D54FEFFFFDD05582F580A83EC08DD1C24E8DBD0D1FADD9D4CFEFFFFDD8554FEFFFFDC854CFEFFFF83EC08DD1C24E8060ED1FA898548FEFFFF908B8548FEFFFF83C008898544FEFFFFD905602F580AD805682F580ADD9D3CFEFFFFDD853CFEFFFF83EC08DD1C24E8CD0DD1FA898538FEFFFF908B8544FEFFFF038538FEFFFF898534FEFFFFD9056C2F580AD825702F580A83EC08DD1C24E89D0DD1FA898530FEFFFFFFB534FEFFFFFFB530FEFFFF68A0CC72088B8D38F9FFFF8B955CFEFFFFE82D228CFE898534F9FFFF8B8534F9FFFF89458CFF758C8B8DB0FEFFFF8B953CF9FFFF8B410C8B4904FFD089852CFEFFFF90908D65F85E5F5DC20400")
write_bin("func1.bin", a)
#  System.String FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNdFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String) 
a = bytes.fromhex("558BEC575681ECA80300008BF18DBD50FCFFFFB9E900000033C0F3AB8BCE898D98FCFFFF833D64433601007405E8C6DD8E5433D289956CFFFFFFB8DD5901008D8023A6FEFF89856CFFFFFF90E9C2000000908B856CFFFFFFBAE28500008D921F7AFFFF3BC2751F8B0DA826C7038B410C8B4904FFD0B8432501008D80BFDAFEFF89856CFFFFFF908B856CFFFFFFBA9BDF00008D926720FFFF3BC275368B0DB027C7038B410C8B4904FFD0898554FCFFFF8B8554FCFFFF8D157826C703E897EB5B54B8A71F01008D805CE0FEFF89856CFFFFFF908B856CFFFFFFBA171D01008D92E9E2FEFF3BC2751290B8CC5E00008D8035A1FFFF89856CFFFFFF908B856CFFFFFFBABA7001008D92498FFEFF3BC2750390EB0690E938FFFFFF90B918473601BA4D000000E88FFE9CF6A1E028C703898594FCFFFF8B8598FCFFFF898590FCFFFF8B0510558A0489858CFCFFFFDD055844770ADC256044770A83EC08DD1C24E84503CEFA898568FFFFFF908B8568FFFFFF40898564FFFFFFD9056844770ADD9D5CFFFFFFDD057044770A83EC08DD1C24E844C75E54DD9D54FFFFFFDD855CFFFFFFDCA554FFFFFF83EC08DD1C24E8F702CEFA898550FFFFFF908B8564FFFFFF038550FFFFFF89854CFFFFFFDD057844770ADD9D44FFFFFFDD058044770A83EC08DD1C24E88103B754DD9D3CFFFFFFDD8544FFFFFFDC853CFFFFFF83EC08DD1C24E8A402CEFA898538FFFFFF908B8538FFFFFF83C0F0898534FFFFFFDD058844770ADD9D2CFFFFFFDD059044770A83EC08DD1C24E84103B754DD9D24FFFFFFDD852CFFFFFFDCA524FFFFFF83EC08DD1C24E85402CEFA898520FFFFFF908B8534FFFFFF038520FFFFFF89851CFFFFFFD9059844770ADD9D14FFFFFFDD05A044770A83EC08DD1C24E84EC65E54DD9D0CFFFFFFDD8514FFFFFFDCA50CFFFFFF83EC08DD1C24E80102CEFA898508FFFFFF908B8508FFFFFF83C008898504FFFFFFD905A844770ADD9DFCFEFFFFDD05B044770A83EC08DD1C24E81E02B754DD9DF4FEFFFFDD85FCFEFFFFDC85F4FEFFFFDD9DECFEFFFFDD85ECFEFFFF83EC08DD1C24E8A501CEFA8985E8FEFFFFFFB51CFFFFFF8B8504FFFFFF0385E8FEFFFF506824CC81088B8D8CFCFFFF8B954CFFFFFFE81E08CFFE898588FCFFFF8B8588FCFFFF8945CC908B45CC898584FCFFFF8B0578588A0489458C8B1578588A048B4D8CE8E618C6FA8985E4FEFFFF8B8594FCFFFF8985E0FEFFFF8B8590FCFFFF8985DCFEFFFF8B8584FCFFFF8985D8FEFFFF83BDE4FEFFFF0075308B85E0FEFFFF8985D4FEFFFF8B85DCFEFFFF8985D0FEFFFF8B85D8FEFFFF8985CCFEFFFFC785C8FEFFFF55DE130FEB2E8B85E0FEFFFF8985D4FEFFFF8B85DCFEFFFF8985D0FEFFFF8B85D8FEFFFF8985CCFEFFFFC785C8FEFFFF54DE130F8B85C8FEFFFF8945888B057C588A04894584C785C4FEFFFF54DE130F8B157C588A048B4D84E82B18C6FA8985C0FEFFFF8B85D4FEFFFF8985BCFEFFFF8B85D0FEFFFF8985B8FEFFFF8B85CCFEFFFF8985B4FEFFFF8B85C4FEFFFF8985B0FEFFFF83BDC0FEFFFF00753C8B85BCFEFFFF8985ACFEFFFF8B85B8FEFFFF8985A8FEFFFF8B85B4FEFFFF8985A4FEFFFF8B85B0FEFFFF8985A0FEFFFFC7859CFEFFFFD6DD130FEB3A8B85BCFEFFFF8985ACFEFFFF8B85B8FEFFFF8985A8FEFFFF8B85B4FEFFFF8985A4FEFFFF8B85B0FEFFFF8985A0FEFFFFC7859CFEFFFFD5DD130F8B859CFEFFFF894580908B85A0FEFFFFBAD5DD130F33C248898598FEFFFFD905B844770ADD9D90FEFFFFDD05C044770A83EC08DD1C24E8AB00B754DD9D88FEFFFFDD8590FEFFFFDC8588FEFFFF83EC08DD1C24E87EFFCDFA898584FEFFFF8B8598FEFFFF2B8584FEFFFF8945C4908B45C4898580FEFFFFD905C844770AD835D044770A83EC08DD1C24E848FFCDFA89857CFEFFFF908B857CFEFFFF40898578FEFFFFDD05D844770ADD9D70FEFFFFDD05E044770A83EC08DD1C24E887C57154DD9D68FEFFFFDD8570FEFFFFDCA568FEFFFF83EC08DD1C24E8FAFECDFA898564FEFFFF8B8578FEFFFF038564FEFFFF8945BCFFB5A4FEFFFFFFB580FEFFFFFF75BC8B8DACFEFFFF8B95A8FEFFFF8B410C8B4904FFD0898580FCFFFF8B8580FCFFFF8D157C26C703E85BE65B5490D905E844770ADD9D5CFEFFFFDD05F044770A83EC08DD1C24E8BDC25E54DD9D54FEFFFFDD855CFEFFFFDCA554FEFFFF83EC08DD1C24E870FECDFA898550FEFFFF908B8550FEFFFF4089854CFEFFFFD905F844770AD8050045770A83EC08DD1C24E845FECDFA898548FEFFFF8B854CFEFFFF2B8548FEFFFF8945B48B45B4A3A447360190E9E7080000A17C26C7038B15A44736013B50047205E86DC68E548B4490088D158026C703E8AEE55B54B918473601BA4E000000E8FFF89CF6A1E828C703898550FCFFFF8B8D50FCFFFF8B158026C7038B410C8B4904FFD0898544FEFFFF83BD44FEFFFF000F85EE07000090B918473601BA4C000000E8BDF89CF6A1D828C70389857CFCFFFFA17826C703898578FCFFFFB918473601BA4B000000E898F89CF6A1CC28C703898574FCFFFFB918473601BA4F000000E87EF89CF6A1F028C703898570FCFFFFA18026C70389856CFCFFFFD9050445770AD8350845770A83EC08DD1C24E841FDCDFA898520FEFFFF908B8520FEFFFF404089851CFEFFFFD9050C45770AD8351045770A83EC08DD1C24E815FDCDFA898518FEFFFF8B851CFEFFFF038518FEFFFF8945ACFF75AC8B8D70FCFFFF8B956CFCFFFF8B410C8B4904FFD0898514FEFFFF8B8D74FCFFFF8B9514FEFFFF8B410C8B4904FFD0898510FEFFFFFFB510FEFFFF8B8D7CFCFFFF8B9578FCFFFF8B410C8B4904FFD089850CFEFFFF9090E9D3060000898568FCFFFF8B8568FCFFFF8D158426C703E83BE45B5490B918473601BA25000000E88BF79CF6A11027C703898564FCFFFFB918473601BA50000000E871F79CF6A1F828C703898560FCFFFF8B0510558A0489855CFCFFFFD9051845770ADD9D04FEFFFFDD052045770A83EC08DD1C24E83DFDB654DD9DFCFDFFFFDD8504FEFFFFDCA5FCFDFFFF83EC08DD1C24E810FCCDFA8985F8FDFFFF908B85F8FDFFFF408985F4FDFFFFD9052845770ADD9DECFDFFFFDD053045770A83EC08DD1C24E82FFCB654DD9DE4FDFFFFDD85ECFDFFFFDCA5E4FDFFFF83EC08DD1C24E8C2FBCDFA8985E0FDFFFF908B85F4FDFFFF0385E0FDFFFF8985DCFDFFFFDD053845770AD8354045770A83EC08DD1C24E892FBCDFA8985D8FDFFFF908B85D8FDFFFF40408985D4FDFFFFDD054845770ADD9DCCFDFFFFDD055045770A83EC08DD1C24E830FCB654DD9DC4FDFFFFDD85CCFDFFFFDCA5C4FDFFFF83EC08DD1C24E843FBCDFA8985C0FDFFFF908B85D4FDFFFF2B85C0FDFFFF8985BCFDFFFFDD055845770ADD9DB4FDFFFFDD056045770A83EC08DD1C24E8CDFBB654DD9DACFDFFFFDD85B4FDFFFFDCA5ACFDFFFF83EC08DD1C24E8F0FACDFA8985A8FDFFFF908B85A8FDFFFF408985A4FDFFFF8B0580588A0489857CFFFFFF8B1580588A048B8D7CFFFFFFE85F12C6FA8985A0FDFFFF8B8564FCFFFF89859CFDFFFF8B8560FCFFFF898598FDFFFF8B855CFCFFFF898594FDFFFF8B85DCFDFFFF898590FDFFFF8B85BCFDFFFF89858CFDFFFF8B85A4FDFFFF898588FDFFFF83BDA0FDFFFF0075548B859CFDFFFF898584FDFFFF8B8598FDFFFF898580FDFFFF8B8594FDFFFF89857CFDFFFF8B8590FDFFFF898578FDFFFF8B858CFDFFFF898574FDFFFF8B8588FDFFFF898570FDFFFFC7856CFDFFFFB0031E6CEB528B859CFDFFFF898584FDFFFF8B8598FDFFFF898580FDFFFF8B8594FDFFFF89857CFDFFFF8B8590FDFFFF898578FDFFFF8B858CFDFFFF898574FDFFFF8B8588FDFFFF898570FDFFFFC7856CFDFFFFAF031E6C8B856CFDFFFF898578FFFFFF8B0584588A04898574FFFFFFC78568FDFFFFAF031E6C8B1588588A048B8D74FFFFFFE82F11C6FA898564FDFFFF8B8584FDFFFF898560FDFFFF8B8580FDFFFF89855CFDFFFF8B857CFDFFFF898558FDFFFF8B8578FDFFFF898554FDFFFF8B8574FDFFFF898550FDFFFF8B8570FDFFFF89854CFDFFFF8B8568FDFFFF898548FDFFFF83BD64FDFFFF0075608B8560FDFFFF898544FDFFFF8B855CFDFFFF898540FDFFFF8B8558FDFFFF89853CFDFFFF8B8554FDFFFF898538FDFFFF8B8550FDFFFF898534FDFFFF8B854CFDFFFF898530FDFFFF8B8548FDFFFF89852CFDFFFFC78528FDFFFF7D031E6CEB5E8B8560FDFFFF898544FDFFFF8B855CFDFFFF898540FDFFFF8B8558FDFFFF89853CFDFFFF8B8554FDFFFF898538FDFFFF8B8550FDFFFF898534FDFFFF8B854CFDFFFF898530FDFFFF8B8548FDFFFF89852CFDFFFFC78528FDFFFF7E031E6C8B8528FDFFFF898570FFFFFFFFB534FDFFFF8B8530FDFFFF8B952CFDFFFFB97D031E6C33D12BC2506898CD81088B8D3CFDFFFF8B9538FDFFFFE84023CFFE898524FDFFFF8B8524FDFFFF8945A4908B45A4898520FDFFFFA18026C70389851CFDFFFF8B0510558A04898518FDFFFFDD056845770ADD9D10FDFFFFDD057045770A83EC08DD1C24E813BC5E54DD9D08FDFFFFDD8510FDFFFFDCA508FDFFFF83EC08DD1C24E8C6F7CDFA898504FDFFFF908B8504FDFFFF83C004898500FDFFFFD9057845770AD8258045770A83EC08DD1C24E899F7CDFA8985FCFCFFFF908B8500FDFFFF2B85FCFCFFFF8985F8FCFFFFDD058845770ADD9DF0FCFFFFDD059045770A83EC08DD1C24E873F8B654DD9DE8FCFFFFDD85F0FCFFFFDC85E8FCFFFF83EC08DD1C24E846F7CDFA8985E4FCFFFF908B85E4FCFFFF83C0F88985E0FCFFFFD9059845770ADD9DD8FCFFFFDD05A045770A83EC08DD1C24E843BB5E54DD9DD0FCFFFFDD85D8FCFFFFDC85D0FCFFFF83EC08DD1C24E8F6F6CDFA8985CCFCFFFF908B85E0FCFFFF2B85CCFCFFFF8985C8FCFFFFD905A845770AD805B045770A83EC08DD1C24E8C6F6CDFA8985C4FCFFFF908B85C4FCFFFF48488985C0FCFFFFDD05B845770ADD9DB8FCFFFFDD05C045770A83EC08DD1C24E864F7B654DD9DB0FCFFFFDD85B8FCFFFFDC85B0FCFFFF83EC08DD1C24E877F6CDFA8985ACFCFFFFFFB5C8FCFFFF8B85C0FCFFFF0385ACFCFFFF506898CD81088B8D18FDFFFF8B95F8FCFFFFE85821CFFE8985A8FCFFFF8B85A8FCFFFF89459C8B459C8985A4FCFFFF8B0D0C28C7038B158426C7038B410C8B4904FFD08985A0FCFFFFFFB51CFDFFFFFFB5A4FCFFFFFFB5A0FCFFFF8B8D40FDFFFF8B9520FDFFFF8B410C8B4904FFD089859CFCFFFF8B8D44FDFFFF8B959CFCFFFF8B410C8B4904FFD0E872E25B54EB0090A1A4473601898540FEFFFFD905C845770AD825D045770A83EC08DD1C24E8ACF5CDFA89853CFEFFFF908B853CFEFFFF48898538FEFFFFD905D845770ADD9D30FEFFFFDD05E045770A83EC08DD1C24E86BBA5E54DD9D28FEFFFFDD8530FEFFFFDC8528FEFFFF83EC08DD1C24E85EF5CDFA898524FEFFFF8B8538FEFFFF2B8524FEFFFF8945948B8540FEFFFF034594A3A4473601A1A44736018B157C26C7033B42040F8C05F7FFFF8B0D0828C7038B157826C7038B410C8B4904FFD0898558FCFFFF8B8558FCFFFF8D65F85E5F5DC3")
write_bin("func2.bin", a)
# System.String FUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTNCFUCKED_BY_AD3M_XTNᅠᅠᅠᅠᅠFUCKED_BY_AD3M_XTN(System.String, System.String)
a = bytes.fromhex("558BEC575681ECBC0100008BF18DBD3CFEFFFFB96F00000033C0F3AB8BCE898DACFEFFFF8995A8FEFFFF833D64436801007405E818A7335733D2899554FFFFFFB8D37401008D802D8BFEFF898554FFFFFF90E95E010000908B8554FFFFFFBA542B00008D92AFD4FFFF3BC275228B85A8FEFFFF8D1570262D04E832B50057B8E40101008D8020FEFEFF898554FFFFFF908B8554FFFFFFBAFA3100008D920BCEFFFF3BC275328B150C59F0048B4D8CE8EDE4C5FA8985B0FEFFFF83BDB0FEFFFF000F8500010000B86C9B00008D809A64FFFF898554FFFFFF908B8554FFFFFFBAFC5500008D9205AAFFFF3BC2751F8B0DA8262D048B410C8B4904FFD0B88A1800008D8078E7FFFF898554FFFFFF908B8554FFFFFFBA8ABE00008D927841FFFF3BC275228B85ACFEFFFF8D156C262D04E87DB40057B817E700008D80EC18FFFF898554FFFFFF908B8554FFFFFFBA2A7901008D92DA86FEFF3BC2751A8B051059F00489458CB8136E00008D80F291FFFF898554FFFFFF908B8554FFFFFFBA492601008D92B7D9FEFF3BC2751290B88C7E00008D807581FFFF898554FFFFFF908B8554FFFFFFBA51DA00008D92B525FFFF3BC2750390EB0690E99CFEFFFF9033D2899550FFFFFFEB0AC78550FFFFFF010000008B8550FFFFFF89458833D28955CC8B45CCA388476801B918476801BA48000000E81BC76BF6A1A8282D04898544FEFFFF8B8D44FEFFFF8B1570262D048B410C8B4904FFD089854CFFFFFF8B854CFFFFFFA38C4768018B051459F0048945848B151859F0048B4D84E864E3C5FA898548FFFFFF83BD48FFFFFF00750D90C78544FFFFFF01000000EB0AC78544FFFFFF020000008B8544FFFFFF894580C745C4010000008B45C4A39047680190E94C0200008B051C59F00489857CFFFFFFA188476801898540FFFFFFB918476801BA48000000E86AC66BF6A1AC282D048985A4FEFFFFB918476801BA49000000E850C66BF6A1B8282D048985A0FEFFFFA170262D0489859CFEFFFFA19047680189853CFFFFFF8B151C59F0048B8D7CFFFFFFE8AEE2C5FA898538FFFFFF8B8540FFFFFF898534FFFFFF8B85A4FEFFFF898598FEFFFF8B85A0FEFFFF898594FEFFFF8B859CFEFFFF898590FEFFFF8B853CFFFFFF898530FFFFFF83BD38FFFFFF0075488B8534FFFFFF89852CFFFFFF8B8598FEFFFF89858CFEFFFF8B8594FEFFFF898588FEFFFF8B8590FEFFFF898584FEFFFF8B8530FFFFFF898528FFFFFFC78524FFFFFF02000000EB468B8534FFFFFF89852CFFFFFF8B8598FEFFFF89858CFEFFFF8B8594FEFFFF898588FEFFFF8B8590FEFFFF898584FEFFFF8B8530FFFFFF898528FFFFFFC78524FFFFFF010000008B8524FFFFFF898578FFFFFFC745BC01000000FFB528FFFFFFFF75BC8B8D88FEFFFF8B9584FEFFFF8B410C8B4904FFD0898580FEFFFF8B8D8CFEFFFF8B9580FEFFFF8B410C8B4904FFD0898520FFFFFF8B852CFFFFFF038520FFFFFF7105E8C2953357A3884768018B052059F004898574FFFFFFA19047680189851CFFFFFF8B152459F0048B8D74FFFFFFE845E1C5FA898518FFFFFF8B851CFFFFFF898514FFFFFF83BD18FFFFFF0075188B8514FFFFFF898510FFFFFFC7850CFFFFFF01000000EB168B8514FFFFFF898510FFFFFFC7850CFFFFFF020000008B850CFFFFFF898570FFFFFFC745B4010000008B8510FFFFFF0345B47105E829953357A390476801A1904768013B058C4768010F8EA3FDFFFF90A188476801898508FFFFFFDD051874DA0ADD9D00FFFFFFDD052074DA0A83EC08DD1C24E8EAC85B57DD9DF8FEFFFFDD8500FFFFFFDCA5F8FEFFFF83EC08DD1C24E8DDC8CDFA8985F4FEFFFF8B85F4FEFFFF8945AC8B8508FFFFFF99F77DAC891594476801B918476801BA48000000E8BFC36BF6A1A8282D04898540FEFFFF8B8D40FEFFFF8B156C262D048B410C8B4904FFD08985F0FEFFFF8B85F0FEFFFFA398476801B918476801BA4A000000E880C36BF6A1C0282D0489853CFEFFFF8B8D3CFEFFFF8B15984768018B410C8B4904FFD089857CFEFFFF8B857CFEFFFF8D1574262D04E8EAAF00578B052859F00489856CFFFFFF8B152C59F0048B8D6CFFFFFFE8BDDFC5FA8985ECFEFFFF83BDECFEFFFF00750D90C785E8FEFFFF01000000EB0AC785E8FEFFFF020000008B85E8FEFFFF898568FFFFFFC745A4010000008B45A4A39C47680190E9600200008B053059F004898564FFFFFFB918476801BA48000000E8CBC26BF6A1AC282D04898578FEFFFFB918476801BA49000000E8B1C26BF6A1B8282D04898574FEFFFFA16C262D04898570FEFFFFA19C4768018985E4FEFFFF8B153459F0048B8D64FFFFFFE80FDFC5FA8985E0FEFFFF8B8578FEFFFF89856CFEFFFF8B8574FEFFFF898568FEFFFF8B8570FEFFFF898564FEFFFF8B85E4FEFFFF8985DCFEFFFF83BDE0FEFFFF00753C8B856CFEFFFF898560FEFFFF8B8568FEFFFF89855CFEFFFF8B8564FEFFFF898558FEFFFF8B85DCFEFFFF8985D8FEFFFFC785D4FEFFFF01000000EB3A8B856CFEFFFF898560FEFFFF8B8568FEFFFF89855CFEFFFF8B8564FEFFFF898558FEFFFF8B85DCFEFFFF8985D8FEFFFFC785D4FEFFFF020000008B85D4FEFFFF898560FFFFFFC7459C01000000FFB5D8FEFFFFFF759C8B8D5CFEFFFF8B9558FEFFFF8B410C8B4904FFD0898554FEFFFF8B8D60FEFFFF8B9554FEFFFF8B410C8B4904FFD08985D0FEFFFF8B85D0FEFFFF030594476801A3A0476801A1D8282D04898550FEFFFFA174262D0489854CFEFFFF8B0DC8282D048B15A04768018B410C8B4904FFD08985CCFEFFFFFFB5CCFEFFFF8B8D50FEFFFF8B954CFEFFFF8B410C8B4904FFD08985C8FEFFFF908B053859F00489855CFFFFFFA19C4768018985C4FEFFFF8B153859F0048B8D5CFFFFFFE880DDC5FA8985C0FEFFFF8B85C4FEFFFF8985BCFEFFFF83BDC0FEFFFF0075188B85BCFEFFFF8985B8FEFFFFC785B4FEFFFF02000000EB168B85BCFEFFFF8985B8FEFFFFC785B4FEFFFF010000008B85B4FEFFFF898558FFFFFFC74594010000008B85B8FEFFFF034594A39C476801A19C4768013B05984768010F8E8FFDFFFF8B0D08282D048B1574262D048B410C8B4904FFD0898548FEFFFF8B8548FEFFFF8D65F85E5F5DC3")
write_bin("func3.bin", a)
```

The decompiled result will looks bad, but we still can understand the big picture of it. The idea is by tracing through call stack when breakpoint on imported function hit.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FjJtaj9pIz4iu45kE3cup%2Fimage.png?alt=media&amp;token=929c424c-0347-4543-ab6f-4e2694ad27c7" alt=""><figcaption></figcaption></figure>

Example in image above we can see that address `0x0B0334A8+0x5E6` is return from Split function call in native function so we can create comment on it (would be nice if we can create struct but too lazy at the moment).&#x20;

{% code title="func1.bin" %}

```c
int __fastcall sub_5942130(int a1, int a2, int a3)
{
  int result; // eax
  int v4; // eax
  _BYTE v5[1860]; // [esp+1A0h] [ebp-750h] BYREF
  int v6; // [esp+8E4h] [ebp-Ch]

  memset(v5, 0, sizeof(v5));
  *(_DWORD *)&v5[156] = a1;
  v6 = a2;
  if ( MEMORY[0xC84364] )
    MEMORY[0x5D3B2770]();
  for ( *(_DWORD *)&v5[1648] = 0; ; *(_DWORD *)&v5[1648] = 1 )
  {
    if ( *(_DWORD *)&v5[1648] == 1 )
    {
      (*(void (__fastcall **)(_DWORD))(MEMORY[0x3BE26A8] + 12))(*(_DWORD *)(MEMORY[0x3BE26A8] + 4));
      *(_DWORD *)&v5[1648] = 2;
    }
    if ( *(_DWORD *)&v5[1648] == 2 )
      break;
  }
  MEMORY[0xFC034930](13125400, 65);
  *(_DWORD *)&v5[76] = MEMORY[0x3BE2878];
  *(_DWORD *)&v5[72] = MEMORY[0x4815510];
  *(double *)&v5[828] = MEMORY[0xA582C18];
  *(double *)&v5[820] = MEMORY[0x5D634EF0](MEMORY[0xA582C20], MEMORY[0xA582C24]);
  *(_DWORD *)&v5[816] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(*(double *)&v5[828] + *(double *)&v5[820]),
                          HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[828] + *(double *)&v5[820])));
  *(_DWORD *)&v5[812] = *(_DWORD *)&v5[816] + 1;
  *(_DWORD *)&v5[1748] = MEMORY[0x4815830];
  *(_DWORD *)&v5[808] = MEMORY[0x5D65C0](MEMORY[0x4815830], MEMORY[0x4815834]);
  *(_DWORD *)&v5[804] = *(_DWORD *)&v5[76];
  *(_DWORD *)&v5[800] = *(_DWORD *)&v5[72];
  *(_DWORD *)&v5[796] = *(_DWORD *)&v5[812];
  *(_DWORD *)&v5[792] = *(_DWORD *)&v5[76];
  *(_DWORD *)&v5[788] = *(_DWORD *)&v5[72];
  *(_DWORD *)&v5[784] = *(_DWORD *)&v5[812];
  if ( *(_DWORD *)&v5[808] )
    *(_DWORD *)&v5[780] = 959532201;
  else
    *(_DWORD *)&v5[780] = 959532200;
  *(_DWORD *)&v5[1744] = *(_DWORD *)&v5[780];
  *(_DWORD *)&v5[1740] = MEMORY[0x4815838];
  *(_DWORD *)&v5[776] = 959532200;
  *(_DWORD *)&v5[772] = MEMORY[0x5D65C0](MEMORY[0x4815838], MEMORY[0x4815838]);
  *(_DWORD *)&v5[768] = *(_DWORD *)&v5[792];
  *(_DWORD *)&v5[764] = *(_DWORD *)&v5[788];
  *(_DWORD *)&v5[760] = *(_DWORD *)&v5[784];
  *(_DWORD *)&v5[756] = *(_DWORD *)&v5[776];
  *(_DWORD *)&v5[752] = *(_DWORD *)&v5[792];
  *(_DWORD *)&v5[748] = *(_DWORD *)&v5[788];
  *(_DWORD *)&v5[744] = *(_DWORD *)&v5[784];
  *(_DWORD *)&v5[740] = *(_DWORD *)&v5[776];
  if ( *(_DWORD *)&v5[772] )
    *(_DWORD *)&v5[736] = 959532054;
  else
    *(_DWORD *)&v5[736] = 959532055;
  *(_DWORD *)&v5[1736] = *(_DWORD *)&v5[736];
  *(_DWORD *)&v5[732] = (*(_DWORD *)&v5[740] ^ 0x39314C16) + *(_DWORD *)&v5[744];
  *(double *)&v5[724] = MEMORY[0xA582C28];
  *(double *)&v5[716] = MEMORY[0x5D0B1310](MEMORY[0xA582C30], MEMORY[0xA582C34]);
  *(_DWORD *)&v5[712] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(*(double *)&v5[724] + *(double *)&v5[716]),
                          HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[724] + *(double *)&v5[716])));
  *(_DWORD *)&v5[708] = *(_DWORD *)&v5[712] - 16;
  *(_DWORD *)&v5[704] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(MEMORY[0xA582C38] / MEMORY[0xA582C40]),
                          HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582C38] / MEMORY[0xA582C40])));
  *(_DWORD *)&v5[700] = *(_DWORD *)&v5[704] + *(_DWORD *)&v5[708];
  *(double *)&v5[692] = MEMORY[0xA582C48];
  *(double *)&v5[684] = MEMORY[0x5D634F60](MEMORY[0xA582C50], MEMORY[0xA582C54]);
  *(_DWORD *)&v5[680] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(*(double *)&v5[692] - *(double *)&v5[684]),
                          HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[692] - *(double *)&v5[684])));
  *(_DWORD *)&v5[676] = *(_DWORD *)&v5[680] + 8;
  *(double *)&v5[668] = MEMORY[0xA582C58];
  *(double *)&v5[660] = MEMORY[0x5D634F30](MEMORY[0xA582C60], MEMORY[0xA582C64]);
  *(_DWORD *)&v5[656] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(*(double *)&v5[668] - *(double *)&v5[660]),
                          HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[668] - *(double *)&v5[660])));
  *(_DWORD *)&v5[68] = MEMORY[0x416AE40](
                         *(_DWORD *)&v5[748],
                         *(_DWORD *)&v5[732],
                         141740968,
                         *(_DWORD *)&v5[656] + *(_DWORD *)&v5[676],
                         *(_DWORD *)&v5[700]);
  *(_DWORD *)&v5[1844] = *(_DWORD *)&v5[68];
  *(_DWORD *)&v5[64] = (*(int (__fastcall **)(_DWORD, _DWORD))(*(_DWORD *)&v5[752] + 12))(// call func2
                         *(_DWORD *)(*(_DWORD *)&v5[752] + 4),
                         *(_DWORD *)&v5[68]);
  MEMORY[0x5D0835D0]();
  *(_DWORD *)&v5[60] = MEMORY[0x3BE2840];
  *(_DWORD *)&v5[56] = (*(int (__fastcall **)(_DWORD))(MEMORY[0x3BE2798] + 12))(*(_DWORD *)(MEMORY[0x3BE2798] + 4));
  *(_DWORD *)&v5[52] = (*(int (__fastcall **)(_DWORD, _DWORD))(MEMORY[0x3BE2824] + 12))(// call FromBase64String(val)
                         *(_DWORD *)(MEMORY[0x3BE2824] + 4),
                         MEMORY[0x3BE265C]);
  *(_DWORD *)&v5[48] = (*(int (__fastcall **)(_DWORD, _DWORD, _DWORD))(*(_DWORD *)&v5[60] + 12))(
                         *(_DWORD *)(*(_DWORD *)&v5[60] + 4),
                         *(_DWORD *)&v5[56],
                         *(_DWORD *)&v5[52]);
  MEMORY[0x5D0835D0]();
  MEMORY[0xFC034930](13125400, 66);
  *(_DWORD *)&v5[44] = MEMORY[0x3BE2880];
  *(_DWORD *)&v5[40] = MEMORY[0x3BE26F4];
  *(_DWORD *)&v5[36] = MEMORY[0x4815510];
  *(_DWORD *)&v5[652] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(MEMORY[0xA582C68] * MEMORY[0xA582C70]),
                          HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582C68] * MEMORY[0xA582C70])));
  *(_DWORD *)&v5[648] = *(_DWORD *)&v5[652] - 1;
  *(_DWORD *)&v5[644] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(MEMORY[0xA582C78] * MEMORY[0xA582C80]),
                          HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582C78] * MEMORY[0xA582C80])));
  *(_DWORD *)&v5[640] = *(_DWORD *)&v5[648] - *(_DWORD *)&v5[644];
  *(_DWORD *)&v5[636] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(MEMORY[0xA582C88] + MEMORY[0xA582C90]),
                          HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582C88] + MEMORY[0xA582C90])));
  *(_DWORD *)&v5[632] = *(_DWORD *)&v5[636] + 1;
  *(double *)&v5[624] = MEMORY[0xA582C98];
  *(double *)&v5[616] = MEMORY[0x5D634F90](MEMORY[0xA582CA0], MEMORY[0xA582CA4]);
  *(_DWORD *)&v5[612] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(*(double *)&v5[624] - *(double *)&v5[616]),
                          HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[624] - *(double *)&v5[616])));
  *(_DWORD *)&v5[608] = *(_DWORD *)&v5[612] + *(_DWORD *)&v5[632];
  *(double *)&v5[600] = MEMORY[0xA582CA8];
  *(double *)&v5[592] = MEMORY[0x5D634F90](MEMORY[0xA582CB0], MEMORY[0xA582CB4]);
  *(_DWORD *)&v5[588] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(*(double *)&v5[600] + *(double *)&v5[592]),
                          HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[600] + *(double *)&v5[592])));
  *(_DWORD *)&v5[584] = *(_DWORD *)&v5[588] + 1;
  *(double *)&v5[576] = MEMORY[0xA582CB8];
  *(double *)&v5[568] = MEMORY[0x5D634F30](MEMORY[0xA582CC0], MEMORY[0xA582CC4]);
  *(double *)&v5[560] = *(double *)&v5[576] - *(double *)&v5[568];
  *(_DWORD *)&v5[556] = MEMORY[0x654E20](*(_DWORD *)&v5[560], *(_DWORD *)&v5[564]);
  *(_DWORD *)&v5[32] = MEMORY[0x416AE40](
                         *(_DWORD *)&v5[36],
                         *(_DWORD *)&v5[640],
                         141740968,
                         *(_DWORD *)&v5[584] - *(_DWORD *)&v5[556],
                         *(_DWORD *)&v5[608]);
  *(_DWORD *)&v5[1836] = *(_DWORD *)&v5[32];
  *(_DWORD *)&v5[28] = (*(int (__fastcall **)(_DWORD, _DWORD, _DWORD))(*(_DWORD *)&v5[40] + 12))(// call func3
                         *(_DWORD *)(*(_DWORD *)&v5[40] + 4),
                         *(_DWORD *)&v5[32],
                         MEMORY[0x3BE2660]);
  *(_DWORD *)&v5[24] = MEMORY[0x4815510];
  *(_DWORD *)&v5[552] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(MEMORY[0xA582CC8] / MEMORY[0xA582CD0]),
                          HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582CC8] / MEMORY[0xA582CD0])));
  *(_DWORD *)&v5[548] = *(_DWORD *)&v5[552] - 2;
  *(double *)&v5[540] = MEMORY[0xA582CD8];
  *(double *)&v5[532] = MEMORY[0x5D634E70](MEMORY[0xA582CE0], MEMORY[0xA582CE4]);
  *(_DWORD *)&v5[528] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(*(double *)&v5[540] - *(double *)&v5[532]),
                          HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[540] - *(double *)&v5[532])));
  *(_DWORD *)&v5[524] = *(_DWORD *)&v5[528] + *(_DWORD *)&v5[548];
  *(_DWORD *)&v5[1732] = MEMORY[0x481583C];
  *(_DWORD *)&v5[520] = MEMORY[0x5D65C0](MEMORY[0x481583C], MEMORY[0x4815840]);
  *(_DWORD *)&v5[516] = *(_DWORD *)&v5[44];
  *(_DWORD *)&v5[512] = *(_DWORD *)&v5[28];
  *(_DWORD *)&v5[508] = *(_DWORD *)&v5[24];
  *(_DWORD *)&v5[504] = *(_DWORD *)&v5[524];
  *(_DWORD *)&v5[500] = *(_DWORD *)&v5[44];
  *(_DWORD *)&v5[496] = *(_DWORD *)&v5[28];
  *(_DWORD *)&v5[492] = *(_DWORD *)&v5[24];
  *(_DWORD *)&v5[488] = *(_DWORD *)&v5[524];
  if ( *(_DWORD *)&v5[520] )
    *(_DWORD *)&v5[484] = -1726074513;
  else
    *(_DWORD *)&v5[484] = -1726074514;
  *(_DWORD *)&v5[1728] = *(_DWORD *)&v5[484];
  *(_DWORD *)&v5[1724] = MEMORY[0x4815844];
  *(_DWORD *)&v5[480] = -1726074514;
  *(_DWORD *)&v5[476] = MEMORY[0x5D65C0](MEMORY[0x4815844], MEMORY[0x4815848]);
  *(_DWORD *)&v5[472] = *(_DWORD *)&v5[500];
  *(_DWORD *)&v5[468] = *(_DWORD *)&v5[496];
  *(_DWORD *)&v5[464] = *(_DWORD *)&v5[492];
  *(_DWORD *)&v5[460] = *(_DWORD *)&v5[488];
  *(_DWORD *)&v5[456] = *(_DWORD *)&v5[480];
  *(_DWORD *)&v5[452] = *(_DWORD *)&v5[500];
  *(_DWORD *)&v5[448] = *(_DWORD *)&v5[496];
  *(_DWORD *)&v5[444] = *(_DWORD *)&v5[492];
  *(_DWORD *)&v5[440] = *(_DWORD *)&v5[488];
  *(_DWORD *)&v5[436] = *(_DWORD *)&v5[480];
  if ( *(_DWORD *)&v5[476] )
    *(_DWORD *)&v5[432] = 1714717425;
  else
    *(_DWORD *)&v5[432] = 1714717424;
  *(_DWORD *)&v5[1720] = *(_DWORD *)&v5[432];
  *(_DWORD *)&v5[428] = (*(_DWORD *)&v5[436] ^ 0x663482F0) + 1;
  *(double *)&v5[420] = MEMORY[0xA582CE8];
  *(double *)&v5[412] = MEMORY[0x5D634E70](MEMORY[0xA582CF0], MEMORY[0xA582CF4]);
  *(_DWORD *)&v5[408] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(*(double *)&v5[420] + *(double *)&v5[412]),
                          HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[420] + *(double *)&v5[412])));
  *(_DWORD *)&v5[404] = *(_DWORD *)&v5[408] + *(_DWORD *)&v5[428];
  *(double *)&v5[396] = MEMORY[0xA582CF8];
  *(double *)&v5[388] = MEMORY[0x5D634E10](MEMORY[0xA582D00], MEMORY[0xA582D04]);
  *(_DWORD *)&v5[384] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(*(double *)&v5[396] - *(double *)&v5[388]),
                          HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[396] - *(double *)&v5[388])));
  *(_DWORD *)&v5[380] = *(_DWORD *)&v5[384] + 2;
  *(_DWORD *)&v5[376] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(MEMORY[0xA582D08] - MEMORY[0xA582D10]),
                          HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582D08] - MEMORY[0xA582D10])));
  *(_DWORD *)&v5[20] = MEMORY[0x4206E60](
                         *(_DWORD *)&v5[444],
                         *(_DWORD *)&v5[440],
                         141741340,
                         *(_DWORD *)&v5[380] - *(_DWORD *)&v5[376],
                         *(_DWORD *)&v5[404]);
  *(_DWORD *)&v5[1828] = *(_DWORD *)&v5[20];
  MEMORY[0x5D0835D0]();
  *(_DWORD *)&v5[16] = MEMORY[0x3BE2664];
  *(_DWORD *)&v5[372] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(MEMORY[0xA582D14] + MEMORY[0xA582D18]),
                          HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582D14] + MEMORY[0xA582D18])));
  *(_DWORD *)&v5[368] = *(_DWORD *)&v5[372] + 1;
  *(double *)&v5[360] = MEMORY[0xA582D20];
  *(double *)&v5[352] = MEMORY[0x5D634EE0](MEMORY[0xA582D28], MEMORY[0xA582D2C]);
  *(_DWORD *)&v5[348] = MEMORY[0x654E20](
                          COERCE_UNSIGNED_INT64(*(double *)&v5[360] + *(double *)&v5[352]),
                          HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[360] + *(double *)&v5[352])));
  *(_DWORD *)&v5[1820] = *(_DWORD *)&v5[368] - *(_DWORD *)&v5[348];
  *(_DWORD *)&v5[344] = (*(int (__fastcall **)(_DWORD, _DWORD, int, _DWORD))(*(_DWORD *)&v5[452] + 12))(// call String.Equals(val1, val2, Ordinal)
                          *(_DWORD *)(*(_DWORD *)&v5[452] + 4),
                          *(_DWORD *)&v5[448],
                          *(_DWORD *)&v5[368] - *(_DWORD *)&v5[348],
                          *(_DWORD *)&v5[16]);
  if ( *(_DWORD *)&v5[344] )
  {
    MEMORY[0xFC034930](13125400, 68);
    *(_DWORD *)&v5[12] = MEMORY[0x3BE2888];
    *(_DWORD *)&v5[8] = MEMORY[0x4815510];
    *(_DWORD *)&v5[1716] = MEMORY[0x481584C];
    *(_DWORD *)&v5[340] = MEMORY[0x5D65C0](MEMORY[0x481584C], MEMORY[0x481584C]);
    *(_DWORD *)&v5[336] = *(_DWORD *)&v5[12];
    *(_DWORD *)&v5[332] = *(_DWORD *)&v5[8];
    *(_DWORD *)&v5[328] = *(_DWORD *)&v5[12];
    *(_DWORD *)&v5[324] = *(_DWORD *)&v5[8];
    if ( *(_DWORD *)&v5[340] )
      *(_DWORD *)&v5[320] = 645790797;
    else
      *(_DWORD *)&v5[320] = 645790798;
    *(_DWORD *)&v5[1712] = *(_DWORD *)&v5[320];
    *(_DWORD *)&v5[1708] = MEMORY[0x4815850];
    *(_DWORD *)&v5[316] = 645790797;
    *(_DWORD *)&v5[312] = MEMORY[0x5D65C0](MEMORY[0x4815850], MEMORY[0x4815850]);
    *(_DWORD *)&v5[308] = *(_DWORD *)&v5[328];
    *(_DWORD *)&v5[304] = *(_DWORD *)&v5[324];
    *(_DWORD *)&v5[300] = *(_DWORD *)&v5[316];
    *(_DWORD *)&v5[296] = *(_DWORD *)&v5[328];
    *(_DWORD *)&v5[292] = *(_DWORD *)&v5[324];
    *(_DWORD *)&v5[288] = *(_DWORD *)&v5[316];
    if ( *(_DWORD *)&v5[312] )
      *(_DWORD *)&v5[284] = 1463613567;
    else
      *(_DWORD *)&v5[284] = 1463613568;
    *(_DWORD *)&v5[1704] = *(_DWORD *)&v5[284];
    *(_DWORD *)&v5[280] = (*(_DWORD *)&v5[288] ^ 0x573CF87F) + 4;
    *(double *)&v5[272] = MEMORY[0xA582D30];
    *(double *)&v5[264] = MEMORY[0x5D634EF0](MEMORY[0xA582D38], MEMORY[0xA582D3C]);
    *(_DWORD *)&v5[260] = MEMORY[0x654E20](
                            COERCE_UNSIGNED_INT64(*(double *)&v5[272] + *(double *)&v5[264]),
                            HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[272] + *(double *)&v5[264])));
    *(_DWORD *)&v5[256] = *(_DWORD *)&v5[280] - *(_DWORD *)&v5[260];
    *(double *)&v5[248] = MEMORY[0xA582D40];
    *(double *)&v5[240] = MEMORY[0x6610D8](MEMORY[0xA582D48], MEMORY[0xA582D4C]);
    *(_DWORD *)&v5[236] = MEMORY[0x654E20](
                            COERCE_UNSIGNED_INT64(*(double *)&v5[248] - *(double *)&v5[240]),
                            HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[248] - *(double *)&v5[240])));
    *(_DWORD *)&v5[232] = *(_DWORD *)&v5[236] - 8;
    *(double *)&v5[224] = MEMORY[0xA582D50];
    *(double *)&v5[216] = MEMORY[0x5D634E10](MEMORY[0xA582D58], MEMORY[0xA582D5C]);
    *(_DWORD *)&v5[212] = MEMORY[0x654E20](
                            COERCE_UNSIGNED_INT64(*(double *)&v5[224] - *(double *)&v5[216]),
                            HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[224] - *(double *)&v5[216])));
    *(_DWORD *)&v5[208] = *(_DWORD *)&v5[232] - *(_DWORD *)&v5[212];
    *(double *)&v5[200] = MEMORY[0xA582D60];
    *(double *)&v5[192] = MEMORY[0x5D634E70](MEMORY[0xA582D68], MEMORY[0xA582D6C]);
    *(_DWORD *)&v5[188] = MEMORY[0x654E20](
                            COERCE_UNSIGNED_INT64(*(double *)&v5[200] + *(double *)&v5[192]),
                            HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[200] + *(double *)&v5[192])));
    *(_DWORD *)&v5[184] = *(_DWORD *)&v5[188] - 2;
    *(double *)&v5[176] = MEMORY[0xA582D70];
    *(double *)&v5[168] = MEMORY[0x5D634EE0](MEMORY[0xA582D78], MEMORY[0xA582D7C]);
    *(_DWORD *)&v5[164] = MEMORY[0x654E20](
                            COERCE_UNSIGNED_INT64(*(double *)&v5[176] + *(double *)&v5[168]),
                            HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[176] + *(double *)&v5[168])));
    *(_DWORD *)&v5[1812] = MEMORY[0x4207930](
                             *(_DWORD *)&v5[292],
                             *(_DWORD *)&v5[256],
                             141741464,
                             *(_DWORD *)&v5[164] + *(_DWORD *)&v5[184],
                             *(_DWORD *)&v5[208]);
    result = (*(int (__fastcall **)(_DWORD, _DWORD))(*(_DWORD *)&v5[296] + 12))(
               *(_DWORD *)(*(_DWORD *)&v5[296] + 4),
               *(_DWORD *)&v5[1812]);
    *(_DWORD *)&v5[160] = result;
  }
  else
  {
    MEMORY[0xFC034930](13125400, 37);
    *(_DWORD *)&v5[128] = MEMORY[0x3BE2710];
    *(_DWORD *)&v5[124] = MEMORY[0x4815510];
    *(double *)&v5[1396] = MEMORY[0xA582D80];
    *(double *)&v5[1388] = MEMORY[0x5D634F00](MEMORY[0xA582D88], MEMORY[0xA582D8C]);
    *(_DWORD *)&v5[1384] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1396] + *(double *)&v5[1388]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1396] + *(double *)&v5[1388])));
    *(_DWORD *)&v5[1380] = *(_DWORD *)&v5[1384] - 1;
    *(double *)&v5[1372] = MEMORY[0xA582D90];
    *(double *)&v5[1364] = MEMORY[0x5D634F90](MEMORY[0xA582D98], MEMORY[0xA582D9C]);
    *(_DWORD *)&v5[1360] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1372] + *(double *)&v5[1364]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1372] + *(double *)&v5[1364])));
    *(_DWORD *)&v5[1356] = *(_DWORD *)&v5[1380] - *(_DWORD *)&v5[1360];
    *(_DWORD *)&v5[1352] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(MEMORY[0xA582DA0] / MEMORY[0xA582DA8]),
                             HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582DA0] / MEMORY[0xA582DA8])));
    *(_DWORD *)&v5[1348] = *(_DWORD *)&v5[1352] - 8;
    *(double *)&v5[1340] = MEMORY[0xA582DB0];
    *(double *)&v5[1332] = MEMORY[0x5D0B1250](MEMORY[0xA582DB8], MEMORY[0xA582DBC]);
    *(_DWORD *)&v5[1328] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1340] + *(double *)&v5[1332]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1340] + *(double *)&v5[1332])));
    *(_DWORD *)&v5[1324] = *(_DWORD *)&v5[1348] - *(_DWORD *)&v5[1328];
    *(double *)&v5[1316] = MEMORY[0xA582DC0];
    *(double *)&v5[1308] = MEMORY[0x5D0B1310](MEMORY[0xA582DC8], MEMORY[0xA582DCC]);
    *(_DWORD *)&v5[1304] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1316] - *(double *)&v5[1308]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1316] - *(double *)&v5[1308])));
    *(_DWORD *)&v5[1300] = *(_DWORD *)&v5[1304] + 4;
    *(_DWORD *)&v5[1296] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(MEMORY[0xA582DD0] * MEMORY[0xA582DD8]),
                             HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582DD0] * MEMORY[0xA582DD8])));
    *(_DWORD *)&v5[1292] = *(_DWORD *)&v5[1300] - *(_DWORD *)&v5[1296];
    *(_DWORD *)&v5[120] = MEMORY[0x416AE40](
                            *(_DWORD *)&v5[124],
                            *(_DWORD *)&v5[1356],
                            141740968,
                            *(_DWORD *)&v5[1300] - *(_DWORD *)&v5[1296],
                            *(_DWORD *)&v5[1324]);
    *(_DWORD *)&v5[1804] = *(_DWORD *)&v5[120];
    (*(void (__fastcall **)(_DWORD, _DWORD))(*(_DWORD *)&v5[128] + 12))(
      *(_DWORD *)(*(_DWORD *)&v5[128] + 4),
      *(_DWORD *)&v5[120]);
    MEMORY[0xFC034930](13125400, 68);
    *(_DWORD *)&v5[116] = MEMORY[0x3BE2888];
    *(_DWORD *)&v5[112] = MEMORY[0x4815510];
    *(_DWORD *)&v5[1288] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(MEMORY[0xA582DE0] - MEMORY[0xA582DE8]),
                             HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582DE0] - MEMORY[0xA582DE8])));
    *(_DWORD *)&v5[1284] = *(_DWORD *)&v5[1288] + 4;
    *(double *)&v5[1276] = MEMORY[0xA582DF0];
    *(double *)&v5[1268] = MEMORY[0x5D634EE0](MEMORY[0xA582DF8], MEMORY[0xA582DFC]);
    *(_DWORD *)&v5[1264] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1276] + *(double *)&v5[1268]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1276] + *(double *)&v5[1268])));
    *(_DWORD *)&v5[1260] = *(_DWORD *)&v5[1284] - *(_DWORD *)&v5[1264];
    *(_DWORD *)&v5[1256] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(MEMORY[0xA582E00] - MEMORY[0xA582E08]),
                             HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582E00] - MEMORY[0xA582E08])));
    *(_DWORD *)&v5[1252] = 2 * *(_DWORD *)&v5[1256];
    *(double *)&v5[1244] = MEMORY[0xA582E10];
    *(double *)&v5[1236] = MEMORY[0x5D634F30](MEMORY[0xA582E18], MEMORY[0xA582E1C]);
    *(_DWORD *)&v5[1232] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1244] + *(double *)&v5[1236]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1244] + *(double *)&v5[1236])));
    *(_DWORD *)&v5[1228] = *(_DWORD *)&v5[1232] - 1;
    *(double *)&v5[1220] = MEMORY[0xA582E20];
    *(double *)&v5[1212] = MEMORY[0x5D634EE0](MEMORY[0xA582E28], MEMORY[0xA582E2C]);
    *(_DWORD *)&v5[1208] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1220] + *(double *)&v5[1212]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1220] + *(double *)&v5[1212])));
    *(_DWORD *)&v5[108] = MEMORY[0x42062D8](
                            *(_DWORD *)&v5[112],
                            *(_DWORD *)&v5[1260],
                            141741216,
                            *(_DWORD *)&v5[1208] + *(_DWORD *)&v5[1228],
                            *(_DWORD *)&v5[1252]);
    *(_DWORD *)&v5[1796] = *(_DWORD *)&v5[108];
    *(_DWORD *)&v5[1204] = (*(int (__fastcall **)(_DWORD, _DWORD))(*(_DWORD *)&v5[116] + 12))(
                             *(_DWORD *)(*(_DWORD *)&v5[116] + 4),
                             *(_DWORD *)&v5[108]);
    *(_DWORD *)&v5[1652] = 43423755;
    MEMORY[0xFC034930](13125400, 69);
    *(_DWORD *)&v5[1200] = MEMORY[0x3BE2890];
    *(_DWORD *)&v5[1196] = MEMORY[0x3BE2804];
    *(_DWORD *)&v5[1192] = MEMORY[0x3BE2890];
    *(_DWORD *)&v5[1188] = MEMORY[0x3BE2804];
    *(_DWORD *)&v5[1184] = *(_DWORD *)&v5[156];
    v4 = MEMORY[0x5D0BE020](*(_DWORD *)&v5[156], 135204040);
    *(_DWORD *)&v5[104] = (*(int (__fastcall **)(_DWORD, int, int))(*(_DWORD *)&v5[1188] + 12))(
                            *(_DWORD *)(*(_DWORD *)&v5[1188] + 4),
                            v4,
                            v4);
    *(_DWORD *)&v5[100] = MEMORY[0x4815510];
    *(_DWORD *)&v5[1180] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(MEMORY[0xA582E30] / MEMORY[0xA582E38]),
                             HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582E30] / MEMORY[0xA582E38])));
    *(_DWORD *)&v5[1176] = *(_DWORD *)&v5[1180] + 4;
    *(double *)&v5[1168] = MEMORY[0xA582E40];
    *(double *)&v5[1160] = MEMORY[0x6610D8](MEMORY[0xA582E48], MEMORY[0xA582E4C]);
    *(_DWORD *)&v5[1156] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1168] - *(double *)&v5[1160]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1168] - *(double *)&v5[1160])));
    *(_DWORD *)&v5[1152] = *(_DWORD *)&v5[1156] + *(_DWORD *)&v5[1176];
    *(double *)&v5[1144] = MEMORY[0xA582E50];
    *(double *)&v5[1136] = MEMORY[0x5D634E10](MEMORY[0xA582E58], MEMORY[0xA582E5C]);
    *(_DWORD *)&v5[1132] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1144] - *(double *)&v5[1136]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1144] - *(double *)&v5[1136])));
    *(_DWORD *)&v5[1128] = *(_DWORD *)&v5[1132] - 2;
    *(double *)&v5[1120] = MEMORY[0xA582E60];
    *(double *)&v5[1112] = MEMORY[0x5D634F90](MEMORY[0xA582E68], MEMORY[0xA582E6C]);
    *(_DWORD *)&v5[1108] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1120] - *(double *)&v5[1112]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1120] - *(double *)&v5[1112])));
    *(_DWORD *)&v5[1104] = *(_DWORD *)&v5[1108] + *(_DWORD *)&v5[1128];
    *(double *)&v5[1096] = MEMORY[0xA582E70];
    *(double *)&v5[1088] = MEMORY[0x5D0B1250](MEMORY[0xA582E78], MEMORY[0xA582E7C]);
    *(_DWORD *)&v5[1084] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(*(double *)&v5[1096] - *(double *)&v5[1088]),
                             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1096] - *(double *)&v5[1088])));
    *(_DWORD *)&v5[1080] = *(_DWORD *)&v5[1084] + 1;
    *(double *)&v5[1072] = MEMORY[0x5D634F60](MEMORY[0xA582E80], MEMORY[0xA582E84]);
    *(double *)&v5[1064] = MEMORY[0xA582E88];
    *(_DWORD *)&v5[1060] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(MEMORY[0xA582E88] + *(double *)&v5[1072]),
                             HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582E88] + *(double *)&v5[1072])));
    *(_DWORD *)&v5[96] = MEMORY[0x416AE40](
                           *(_DWORD *)&v5[100],
                           *(_DWORD *)&v5[1152],
                           141740968,
                           *(_DWORD *)&v5[1060] + *(_DWORD *)&v5[1080],
                           *(_DWORD *)&v5[1104]);
    *(_DWORD *)&v5[1788] = *(_DWORD *)&v5[96];
    *(_DWORD *)&v5[92] = *(_DWORD *)&v5[96];
    *(_DWORD *)&v5[1056] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(MEMORY[0xA582E90] - MEMORY[0xA582E98]),
                             HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582E90] - MEMORY[0xA582E98])));
    *(_DWORD *)&v5[1052] = *(_DWORD *)&v5[1056] - 1;
    *(_DWORD *)&v5[1048] = MEMORY[0x654E20](
                             COERCE_UNSIGNED_INT64(MEMORY[0xA582E9C] / MEMORY[0xA582EA0]),
                             HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582E9C] / MEMORY[0xA582EA0])));
    *(_DWORD *)&v5[1780] = *(_DWORD *)&v5[1048] + *(_DWORD *)&v5[1052];
    *(_DWORD *)&v5[1044] = (*(int (__fastcall **)(_DWORD, _DWORD, int, _DWORD))(*(_DWORD *)&v5[1192] + 12))(
                             *(_DWORD *)(*(_DWORD *)&v5[1192] + 4),
                             *(_DWORD *)&v5[104],
                             *(_DWORD *)&v5[1048] + *(_DWORD *)&v5[1052],
                             *(_DWORD *)&v5[92]);
    if ( *(_DWORD *)&v5[1044] )
    {
      MEMORY[0xFC034930](13125400, 70);
      *(_DWORD *)&v5[152] = MEMORY[0x3BE2898];
      *(_DWORD *)&v5[148] = MEMORY[0x4815510];
      *(_DWORD *)&v5[1644] = MEMORY[0x654E20](
                               COERCE_UNSIGNED_INT64(MEMORY[0xA582EE0] / MEMORY[0xA582EE8]),
                               HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582EE0] / MEMORY[0xA582EE8])));
      *(_DWORD *)&v5[1640] = *(_DWORD *)&v5[1644] + 2;
      *(_DWORD *)&v5[1636] = MEMORY[0x654E20](
                               COERCE_UNSIGNED_INT64(MEMORY[0xA582EF0] + MEMORY[0xA582EF8]),
                               HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582EF0] + MEMORY[0xA582EF8])));
      *(_DWORD *)&v5[1632] = *(_DWORD *)&v5[1636] + *(_DWORD *)&v5[1640];
      *(double *)&v5[1624] = MEMORY[0xA582F00];
      *(double *)&v5[1616] = MEMORY[0x5D634EE0](MEMORY[0xA582F08], MEMORY[0xA582F0C]);
      *(_DWORD *)&v5[1612] = MEMORY[0x654E20](
                               COERCE_UNSIGNED_INT64(*(double *)&v5[1624] - *(double *)&v5[1616]),
                               HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1624] - *(double *)&v5[1616])));
      *(_DWORD *)&v5[1608] = *(_DWORD *)&v5[1612] - 16;
      *(_DWORD *)&v5[1668] = MEMORY[0x4815864];
      *(_DWORD *)&v5[1604] = MEMORY[0x5D65C0](MEMORY[0x4815864], MEMORY[0x4815868]);
      *(_DWORD *)&v5[1600] = *(_DWORD *)&v5[152];
      *(_DWORD *)&v5[1596] = *(_DWORD *)&v5[148];
      *(_DWORD *)&v5[1592] = *(_DWORD *)&v5[1632];
      *(_DWORD *)&v5[1588] = *(_DWORD *)&v5[1608];
      *(_DWORD *)&v5[1584] = *(_DWORD *)&v5[152];
      *(_DWORD *)&v5[1580] = *(_DWORD *)&v5[148];
      *(_DWORD *)&v5[1576] = *(_DWORD *)&v5[1632];
      *(_DWORD *)&v5[1572] = *(_DWORD *)&v5[1608];
      if ( *(_DWORD *)&v5[1604] )
        *(_DWORD *)&v5[1568] = 1835221608;
      else
        *(_DWORD *)&v5[1568] = 1835221607;
      *(_DWORD *)&v5[1664] = *(_DWORD *)&v5[1568];
      *(_DWORD *)&v5[1660] = MEMORY[0x481586C];
      *(_DWORD *)&v5[1564] = 1835221607;
      *(_DWORD *)&v5[1560] = MEMORY[0x5D65C0](MEMORY[0x481586C], MEMORY[0x4815870]);
      *(_DWORD *)&v5[1556] = *(_DWORD *)&v5[1584];
      *(_DWORD *)&v5[1552] = *(_DWORD *)&v5[1580];
      *(_DWORD *)&v5[1548] = *(_DWORD *)&v5[1576];
      *(_DWORD *)&v5[1544] = *(_DWORD *)&v5[1572];
      *(_DWORD *)&v5[1540] = *(_DWORD *)&v5[1564];
      *(_DWORD *)&v5[1536] = *(_DWORD *)&v5[1584];
      *(_DWORD *)&v5[1532] = *(_DWORD *)&v5[1580];
      *(_DWORD *)&v5[1528] = *(_DWORD *)&v5[1576];
      *(_DWORD *)&v5[1524] = *(_DWORD *)&v5[1572];
      *(_DWORD *)&v5[1520] = *(_DWORD *)&v5[1564];
      if ( *(_DWORD *)&v5[1560] )
        *(_DWORD *)&v5[1516] = 1835221475;
      else
        *(_DWORD *)&v5[1516] = 1835221474;
      *(_DWORD *)&v5[1656] = *(_DWORD *)&v5[1516];
      *(_DWORD *)&v5[1512] = *(_DWORD *)&v5[1524] - (*(_DWORD *)&v5[1520] ^ 0x6D6341E2);
      *(_DWORD *)&v5[1508] = MEMORY[0x654E20](
                               COERCE_UNSIGNED_INT64(MEMORY[0xA582F10] + MEMORY[0xA582F18]),
                               HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582F10] + MEMORY[0xA582F18])));
      *(_DWORD *)&v5[1504] = *(_DWORD *)&v5[1508] - 1;
      *(double *)&v5[1496] = MEMORY[0xA582F20];
      *(double *)&v5[1488] = MEMORY[0x5D634E70](MEMORY[0xA582F28], MEMORY[0xA582F2C]);
      *(_DWORD *)&v5[1484] = MEMORY[0x654E20](
                               COERCE_UNSIGNED_INT64(*(double *)&v5[1496] + *(double *)&v5[1488]),
                               HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1496] + *(double *)&v5[1488])));
      *(_DWORD *)&v5[144] = MEMORY[0x4206E60](
                              *(_DWORD *)&v5[1532],
                              *(_DWORD *)&v5[1528],
                              141741340,
                              *(_DWORD *)&v5[1484] + *(_DWORD *)&v5[1504],
                              *(_DWORD *)&v5[1512]);
      *(_DWORD *)&v5[1764] = *(_DWORD *)&v5[144];
      *(_DWORD *)&v5[140] = *(_DWORD *)&v5[144];
      *(_DWORD *)&v5[136] = MEMORY[0x4815510];
      *(_DWORD *)&v5[1480] = MEMORY[0x654E20](
                               COERCE_UNSIGNED_INT64(MEMORY[0xA582F30] + MEMORY[0xA582F38]),
                               HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582F30] + MEMORY[0xA582F38])));
      *(_DWORD *)&v5[1476] = *(_DWORD *)&v5[1480] + 1;
      *(double *)&v5[1468] = MEMORY[0xA582F40];
      *(double *)&v5[1460] = MEMORY[0x5D634F30](MEMORY[0xA582F48], MEMORY[0xA582F4C]);
      *(_DWORD *)&v5[1456] = MEMORY[0x654E20](
                               COERCE_UNSIGNED_INT64(*(double *)&v5[1468] - *(double *)&v5[1460]),
                               HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1468] - *(double *)&v5[1460])));
      *(_DWORD *)&v5[1452] = *(_DWORD *)&v5[1476] - *(_DWORD *)&v5[1456];
      *(double *)&v5[1444] = MEMORY[0xA582F50];
      *(double *)&v5[1436] = MEMORY[0x6610D8](MEMORY[0xA582F58], MEMORY[0xA582F5C]);
      *(_DWORD *)&v5[1432] = MEMORY[0x654E20](
                               COERCE_UNSIGNED_INT64(*(double *)&v5[1444] + *(double *)&v5[1436]),
                               HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[1444] + *(double *)&v5[1436])));
      *(_DWORD *)&v5[1428] = *(_DWORD *)&v5[1432] + 8;
      *(double *)&v5[1420] = MEMORY[0xA582F60] + MEMORY[0xA582F68];
      *(_DWORD *)&v5[1416] = MEMORY[0x654E20](*(_DWORD *)&v5[1420], *(_DWORD *)&v5[1424]);
      *(_DWORD *)&v5[1412] = *(_DWORD *)&v5[1416] + *(_DWORD *)&v5[1428];
      *(_DWORD *)&v5[1408] = MEMORY[0x654E20](
                               COERCE_UNSIGNED_INT64(MEMORY[0xA582F6C] - MEMORY[0xA582F70]),
                               HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582F6C] - MEMORY[0xA582F70])));
      *(_DWORD *)&v5[1756] = MEMORY[0x42062D8](
                               *(_DWORD *)&v5[136],
                               *(_DWORD *)&v5[1452],
                               141741216,
                               *(_DWORD *)&v5[1408],
                               *(_DWORD *)&v5[1412]);
      return (*(int (__fastcall **)(_DWORD, _DWORD, _DWORD))(*(_DWORD *)&v5[1536] + 12))(
               *(_DWORD *)(*(_DWORD *)&v5[1536] + 4),
               *(_DWORD *)&v5[140],
               *(_DWORD *)&v5[1756]);
    }
    else
    {
      MEMORY[0xFC034930](13125400, 68);
      *(_DWORD *)&v5[88] = MEMORY[0x3BE2888];
      *(_DWORD *)&v5[84] = MEMORY[0x4815510];
      *(_DWORD *)&v5[1040] = MEMORY[0x654E20](
                               COERCE_UNSIGNED_INT64(MEMORY[0xA582EA8] + MEMORY[0xA582EB0]),
                               HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582EA8] + MEMORY[0xA582EB0])));
      *(_DWORD *)&v5[1036] = *(_DWORD *)&v5[1040] + 2;
      *(_DWORD *)&v5[1700] = MEMORY[0x4815854];
      *(_DWORD *)&v5[1032] = MEMORY[0x5D65C0](MEMORY[0x4815854], MEMORY[0x4815854]);
      *(_DWORD *)&v5[1028] = *(_DWORD *)&v5[88];
      *(_DWORD *)&v5[1024] = *(_DWORD *)&v5[84];
      *(_DWORD *)&v5[1020] = *(_DWORD *)&v5[1036];
      *(_DWORD *)&v5[1016] = *(_DWORD *)&v5[88];
      *(_DWORD *)&v5[1012] = *(_DWORD *)&v5[84];
      *(_DWORD *)&v5[1008] = *(_DWORD *)&v5[1036];
      if ( *(_DWORD *)&v5[1032] )
        *(_DWORD *)&v5[1004] = 800413993;
      else
        *(_DWORD *)&v5[1004] = 800413994;
      *(_DWORD *)&v5[1696] = *(_DWORD *)&v5[1004];
      *(_DWORD *)&v5[1692] = MEMORY[0x4815858];
      *(_DWORD *)&v5[1000] = 800413993;
      *(_DWORD *)&v5[996] = MEMORY[0x5D65C0](MEMORY[0x4815858], MEMORY[0x4815858]);
      *(_DWORD *)&v5[992] = *(_DWORD *)&v5[1016];
      *(_DWORD *)&v5[988] = *(_DWORD *)&v5[1012];
      *(_DWORD *)&v5[984] = *(_DWORD *)&v5[1008];
      *(_DWORD *)&v5[980] = *(_DWORD *)&v5[1000];
      *(_DWORD *)&v5[976] = *(_DWORD *)&v5[1016];
      *(_DWORD *)&v5[972] = *(_DWORD *)&v5[1012];
      *(_DWORD *)&v5[968] = *(_DWORD *)&v5[1008];
      *(_DWORD *)&v5[964] = *(_DWORD *)&v5[1000];
      if ( *(_DWORD *)&v5[996] )
        *(_DWORD *)&v5[960] = 800414636;
      else
        *(_DWORD *)&v5[960] = 800414637;
      *(_DWORD *)&v5[1688] = *(_DWORD *)&v5[960];
      *(_DWORD *)&v5[956] = *(_DWORD *)&v5[968] - (*(_DWORD *)&v5[964] ^ 0x2FB55BAC);
      *(_DWORD *)&v5[952] = MEMORY[0x654E20](
                              COERCE_UNSIGNED_INT64(MEMORY[0xA582EB8] + MEMORY[0xA582EC0]),
                              HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582EB8] + MEMORY[0xA582EC0])));
      *(_DWORD *)&v5[948] = *(_DWORD *)&v5[952] + 16;
      *(_DWORD *)&v5[1684] = MEMORY[0x481585C];
      *(_DWORD *)&v5[944] = MEMORY[0x5D65C0](MEMORY[0x481585C], MEMORY[0x481585C]);
      *(_DWORD *)&v5[940] = *(_DWORD *)&v5[976];
      *(_DWORD *)&v5[936] = *(_DWORD *)&v5[972];
      *(_DWORD *)&v5[932] = *(_DWORD *)&v5[956];
      *(_DWORD *)&v5[928] = *(_DWORD *)&v5[948];
      *(_DWORD *)&v5[924] = *(_DWORD *)&v5[976];
      *(_DWORD *)&v5[920] = *(_DWORD *)&v5[972];
      *(_DWORD *)&v5[916] = *(_DWORD *)&v5[956];
      *(_DWORD *)&v5[912] = *(_DWORD *)&v5[948];
      if ( *(_DWORD *)&v5[944] )
        *(_DWORD *)&v5[908] = 1561321926;
      else
        *(_DWORD *)&v5[908] = 1561321927;
      *(_DWORD *)&v5[1680] = *(_DWORD *)&v5[908];
      *(_DWORD *)&v5[1676] = MEMORY[0x4815860];
      *(_DWORD *)&v5[904] = 1561321926;
      *(_DWORD *)&v5[900] = MEMORY[0x5D65C0](MEMORY[0x4815860], MEMORY[0x4815860]);
      *(_DWORD *)&v5[896] = *(_DWORD *)&v5[924];
      *(_DWORD *)&v5[892] = *(_DWORD *)&v5[920];
      *(_DWORD *)&v5[888] = *(_DWORD *)&v5[916];
      *(_DWORD *)&v5[884] = *(_DWORD *)&v5[912];
      *(_DWORD *)&v5[880] = *(_DWORD *)&v5[904];
      *(_DWORD *)&v5[876] = *(_DWORD *)&v5[924];
      *(_DWORD *)&v5[872] = *(_DWORD *)&v5[920];
      *(_DWORD *)&v5[868] = *(_DWORD *)&v5[916];
      *(_DWORD *)&v5[864] = *(_DWORD *)&v5[912];
      *(_DWORD *)&v5[860] = *(_DWORD *)&v5[904];
      if ( *(_DWORD *)&v5[900] )
        *(_DWORD *)&v5[856] = 1561321703;
      else
        *(_DWORD *)&v5[856] = 1561321704;
      *(_DWORD *)&v5[1672] = *(_DWORD *)&v5[856];
      *(_DWORD *)&v5[852] = (*(_DWORD *)&v5[860] ^ 0x5D0FE0E7) + *(_DWORD *)&v5[864];
      *(_DWORD *)&v5[848] = MEMORY[0x654E20](
                              COERCE_UNSIGNED_INT64(MEMORY[0xA582EC8] * MEMORY[0xA582ED0]),
                              HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582EC8] * MEMORY[0xA582ED0])));
      *(_DWORD *)&v5[844] = *(_DWORD *)&v5[848] - 8;
      *(_DWORD *)&v5[840] = MEMORY[0x654E20](
                              COERCE_UNSIGNED_INT64(MEMORY[0xA582ED4] + MEMORY[0xA582ED8]),
                              HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA582ED4] + MEMORY[0xA582ED8])));
      *(_DWORD *)&v5[1772] = MEMORY[0x42054C8](
                               *(_DWORD *)&v5[872],
                               *(_DWORD *)&v5[868],
                               141741092,
                               *(_DWORD *)&v5[840] + *(_DWORD *)&v5[844],
                               *(_DWORD *)&v5[852]);
      result = (*(int (__fastcall **)(_DWORD, _DWORD))(*(_DWORD *)&v5[876] + 12))(
                 *(_DWORD *)(*(_DWORD *)&v5[876] + 4),
                 *(_DWORD *)&v5[1772]);
      *(_DWORD *)&v5[836] = result;
    }
  }
  return result;
}
```

{% endcode %}

{% code title="func2.bin" %}

```c
int __fastcall sub_ADA34A8(int a1)
{
  _QWORD v2[118]; // [esp+C8h] [ebp-3B0h] BYREF

  memset(v2, 0, 0x3A4u);
  LODWORD(v2[9]) = a1;
  if ( MEMORY[0x1364364] )
    MEMORY[0x5F6912A0]();
  HIDWORD(v2[99]) = 0;
  do
  {
    if ( HIDWORD(v2[99]) == 1 )
    {
      (*(void (__fastcall **)(_DWORD))(MEMORY[0x3C726A8] + 12))(*(_DWORD *)(MEMORY[0x3C726A8] + 4));
      HIDWORD(v2[99]) = 2;
    }
    if ( HIDWORD(v2[99]) == 2 )
    {
      HIDWORD(v2[0]) = (*(int (__fastcall **)(_DWORD))(MEMORY[0x3C727B0] + 12))(*(_DWORD *)(MEMORY[0x3C727B0] + 4));
      MEMORY[0x5F362100]();
      HIDWORD(v2[99]) = 3;
    }
    if ( !HIDWORD(v2[99]) )
      HIDWORD(v2[99]) = 1;
  }
  while ( HIDWORD(v2[99]) != 3 );
  MEMORY[0x1773460](20334360, 77);
  v2[8] = __PAIR64__(MEMORY[0x3C728E0], v2[9]);
  HIDWORD(v2[7]) = MEMORY[0x48A5510];
  LODWORD(v2[99]) = MEMORY[0x5A83950](
                      COERCE_UNSIGNED_INT64(MEMORY[0xA774458] - MEMORY[0xA774460]),
                      HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA774458] - MEMORY[0xA774460])));
  HIDWORD(v2[98]) = LODWORD(v2[99]) + 1;
  *(double *)((char *)&v2[97] + 4) = MEMORY[0xA774468];
  *(double *)((char *)&v2[96] + 4) = MEMORY[0x5F38FD80](MEMORY[0xA774470], MEMORY[0xA774474]);
  LODWORD(v2[96]) = MEMORY[0x5A83950](
                      COERCE_UNSIGNED_INT64(*(double *)((char *)&v2[97] + 4) - *(double *)((char *)&v2[96] + 4)),
                      HIDWORD(COERCE_UNSIGNED_INT64(*(double *)((char *)&v2[97] + 4) - *(double *)((char *)&v2[96] + 4))));
  HIDWORD(v2[95]) = LODWORD(v2[96]) + HIDWORD(v2[98]);
  *(double *)((char *)&v2[94] + 4) = MEMORY[0xA774478];
  *(double *)((char *)&v2[93] + 4) = MEMORY[0x5F913A10](MEMORY[0xA774480], MEMORY[0xA774484]);
  LODWORD(v2[93]) = MEMORY[0x5A83950](
                      COERCE_UNSIGNED_INT64(*(double *)((char *)&v2[94] + 4) + *(double *)((char *)&v2[93] + 4)),
                      HIDWORD(COERCE_UNSIGNED_INT64(*(double *)((char *)&v2[94] + 4) + *(double *)((char *)&v2[93] + 4))));
  HIDWORD(v2[92]) = LODWORD(v2[93]) - 16;
  *(double *)((char *)&v2[91] + 4) = MEMORY[0xA774488];
  *(double *)((char *)&v2[90] + 4) = MEMORY[0x5F913A20](MEMORY[0xA774490], MEMORY[0xA774494]);
  LODWORD(v2[90]) = MEMORY[0x5A83950](
                      COERCE_UNSIGNED_INT64(*(double *)((char *)&v2[91] + 4) - *(double *)((char *)&v2[90] + 4)),
                      HIDWORD(COERCE_UNSIGNED_INT64(*(double *)((char *)&v2[91] + 4) - *(double *)((char *)&v2[90] + 4))));
  HIDWORD(v2[89]) = LODWORD(v2[90]) + HIDWORD(v2[92]);
  *(double *)((char *)&v2[88] + 4) = MEMORY[0xA774498];
  *(double *)((char *)&v2[87] + 4) = MEMORY[0x5F38FD80](MEMORY[0xA7744A0], MEMORY[0xA7744A4]);
  LODWORD(v2[87]) = MEMORY[0x5A83950](
                      COERCE_UNSIGNED_INT64(*(double *)((char *)&v2[88] + 4) - *(double *)((char *)&v2[87] + 4)),
                      HIDWORD(COERCE_UNSIGNED_INT64(*(double *)((char *)&v2[88] + 4) - *(double *)((char *)&v2[87] + 4))));
  HIDWORD(v2[86]) = LODWORD(v2[87]) + 8;
  *(double *)((char *)&v2[85] + 4) = MEMORY[0xA7744A8];
  *(double *)((char *)&v2[84] + 4) = MEMORY[0x5F9139A0](MEMORY[0xA7744B0], MEMORY[0xA7744B4]);
  *(double *)((char *)&v2[83] + 4) = *(double *)((char *)&v2[85] + 4) + *(double *)((char *)&v2[84] + 4);
  LODWORD(v2[83]) = MEMORY[0x5A83950](HIDWORD(v2[83]), v2[84]);
  LODWORD(v2[7]) = MEMORY[0x9A93FF8](
                     HIDWORD(v2[7]),
                     HIDWORD(v2[95]),
                     142724132,
                     LODWORD(v2[83]) + HIDWORD(v2[86]),
                     HIDWORD(v2[89]));
  HIDWORD(v2[111]) = v2[7];
  HIDWORD(v2[6]) = v2[7];
  HIDWORD(v2[103]) = MEMORY[0x48A5878];
  HIDWORD(v2[82]) = MEMORY[0x5A050F0](MEMORY[0x48A5878], MEMORY[0x48A5878]);
  *(_QWORD *)((char *)&v2[81] + 4) = v2[8];
  LODWORD(v2[81]) = HIDWORD(v2[6]);
  v2[80] = v2[8];
  HIDWORD(v2[79]) = HIDWORD(v2[6]);
  if ( HIDWORD(v2[82]) )
    LODWORD(v2[79]) = 252960340;
  else
    LODWORD(v2[79]) = 252960341;
  LODWORD(v2[103]) = v2[79];
  HIDWORD(v2[102]) = MEMORY[0x48A587C];
  HIDWORD(v2[78]) = 252960340;
  LODWORD(v2[78]) = MEMORY[0x5A050F0](MEMORY[0x48A587C], MEMORY[0x48A587C]);
  v2[77] = v2[80];
  v2[76] = __PAIR64__(HIDWORD(v2[79]), HIDWORD(v2[78]));
  v2[75] = v2[80];
  v2[74] = __PAIR64__(HIDWORD(v2[79]), HIDWORD(v2[78]));
  if ( LODWORD(v2[78]) )
    HIDWORD(v2[73]) = 252960213;
  else
    HIDWORD(v2[73]) = 252960214;
  LODWORD(v2[102]) = HIDWORD(v2[73]);
  LODWORD(v2[73]) = (LODWORD(v2[74]) ^ 0xF13DDD5) - 1;
  *(double *)&v2[72] = MEMORY[0xA7744B8];
  *(double *)&v2[71] = MEMORY[0x5F913A60](MEMORY[0xA7744C0], MEMORY[0xA7744C4]);
  HIDWORD(v2[70]) = MEMORY[0x5A83950](
                      COERCE_UNSIGNED_INT64(*(double *)&v2[72] + *(double *)&v2[71]),
                      HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v2[72] + *(double *)&v2[71])));
  HIDWORD(v2[110]) = LODWORD(v2[73]) - HIDWORD(v2[70]);
  LODWORD(v2[70]) = LODWORD(v2[73]) - HIDWORD(v2[70]);
  HIDWORD(v2[69]) = MEMORY[0x5A83950](
                      COERCE_UNSIGNED_INT64(MEMORY[0xA7744C8] / MEMORY[0xA7744D0]),
                      HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA7744C8] / MEMORY[0xA7744D0])));
  LODWORD(v2[69]) = HIDWORD(v2[69]) + 1;
  *(double *)&v2[68] = MEMORY[0xA7744D8];
  *(double *)&v2[67] = MEMORY[0x5F4BFFC0](MEMORY[0xA7744E0], MEMORY[0xA7744E4]);
  HIDWORD(v2[66]) = MEMORY[0x5A83950](
                      COERCE_UNSIGNED_INT64(*(double *)&v2[68] - *(double *)&v2[67]),
                      HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v2[68] - *(double *)&v2[67])));
  HIDWORD(v2[109]) = HIDWORD(v2[66]) + LODWORD(v2[69]);
  LODWORD(v2[6]) = (*(int (__fastcall **)(_DWORD, _DWORD, int, _DWORD, _DWORD))(HIDWORD(v2[75]) + 12))(// call Split(val, " ")
                     *(_DWORD *)(HIDWORD(v2[75]) + 4),
                     v2[75],
                     HIDWORD(v2[66]) + LODWORD(v2[69]),
                     v2[70],
                     HIDWORD(v2[74]));
  MEMORY[0x5F362100]();
  *(double *)((char *)&v2[65] + 4) = MEMORY[0xA7744E8];
  *(double *)((char *)&v2[64] + 4) = MEMORY[0x5F38FD80](MEMORY[0xA7744F0], MEMORY[0xA7744F4]);
  LODWORD(v2[64]) = MEMORY[0x5A83950](
                      COERCE_UNSIGNED_INT64(*(double *)((char *)&v2[65] + 4) - *(double *)((char *)&v2[64] + 4)),
                      HIDWORD(COERCE_UNSIGNED_INT64(*(double *)((char *)&v2[65] + 4) - *(double *)((char *)&v2[64] + 4))));
  HIDWORD(v2[63]) = LODWORD(v2[64]) + 1;
  LODWORD(v2[63]) = MEMORY[0x5A83950](
                      COERCE_UNSIGNED_INT64(MEMORY[0xA7744F8] + MEMORY[0xA774500]),
                      HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA7744F8] + MEMORY[0xA774500])));
  HIDWORD(v2[108]) = HIDWORD(v2[63]) - LODWORD(v2[63]);
  for ( MEMORY[0x13647A4] = HIDWORD(v2[63]) - LODWORD(v2[63]);
        MEMORY[0x13647A4] < *(_DWORD *)(MEMORY[0x3C7267C] + 4);
        MEMORY[0x13647A4] = LODWORD(v2[61]) - HIDWORD(v2[58]) + LODWORD(v2[62]) )
  {
    if ( MEMORY[0x13647A4] >= *(_DWORD *)(MEMORY[0x3C7267C] + 4) )
      MEMORY[0x5F6901B0]();
    MEMORY[0x5F362100]();
    MEMORY[0x1773460](20334360, 78);
    HIDWORD(v2[62]) = (*(int (__fastcall **)(_DWORD, _DWORD, _DWORD))(MEMORY[0x3C728E8] + 12))(
                        *(_DWORD *)(MEMORY[0x3C728E8] + 4),
                        MEMORY[0x3C72680],
                        MEMORY[0x3C728E8]);
    if ( !HIDWORD(v2[62]) )
    {
      MEMORY[0x1773460](20334360, 76);
      v2[5] = __PAIR64__(MEMORY[0x3C728D8], MEMORY[0x3C72678]);
      MEMORY[0x1773460](20334360, 75);
      HIDWORD(v2[4]) = MEMORY[0x3C728CC];
      MEMORY[0x1773460](20334360, 79);
      LODWORD(v2[4]) = MEMORY[0x3C728F0];
      HIDWORD(v2[3]) = MEMORY[0x3C72680];
      LODWORD(v2[58]) = MEMORY[0x5A83950](
                          COERCE_UNSIGNED_INT64(MEMORY[0xA774504] / MEMORY[0xA774508]),
                          HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA774504] / MEMORY[0xA774508])));
      HIDWORD(v2[57]) = LODWORD(v2[58]) + 2;
      LODWORD(v2[57]) = MEMORY[0x5A83950](
                          COERCE_UNSIGNED_INT64(MEMORY[0xA77450C] / MEMORY[0xA774510]),
                          HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA77450C] / MEMORY[0xA774510])));
      HIDWORD(v2[107]) = LODWORD(v2[57]) + HIDWORD(v2[57]);
      HIDWORD(v2[56]) = (*(int (__fastcall **)(_DWORD, _DWORD, int))(LODWORD(v2[4]) + 12))(// call toInt32(val, 0x10)
                          *(_DWORD *)(LODWORD(v2[4]) + 4),
                          HIDWORD(v2[3]),
                          LODWORD(v2[57]) + HIDWORD(v2[57]));
      LODWORD(v2[56]) = (*(int (__fastcall **)(_DWORD, _DWORD))(HIDWORD(v2[4]) + 12))(// call Chr(val)
                          *(_DWORD *)(HIDWORD(v2[4]) + 4),
                          HIDWORD(v2[56]));
      HIDWORD(v2[55]) = (*(int (__fastcall **)(_DWORD, _DWORD, _DWORD))(HIDWORD(v2[5]) + 12))(// call Append(val)
                          *(_DWORD *)(HIDWORD(v2[5]) + 4),
                          v2[5],
                          v2[56]);
    }
    LODWORD(v2[62]) = MEMORY[0x13647A4];
    HIDWORD(v2[61]) = MEMORY[0x5A83950](
                        COERCE_UNSIGNED_INT64(MEMORY[0xA7745C8] - MEMORY[0xA7745D0]),
                        HIDWORD(COERCE_UNSIGNED_INT64(MEMORY[0xA7745C8] - MEMORY[0xA7745D0])));
    LODWORD(v2[61]) = HIDWORD(v2[61]) - 1;
    *(double *)&v2[60] = MEMORY[0xA7745D8];
    *(double *)&v2[59] = MEMORY[0x5F38FE40](MEMORY[0xA7745E0], MEMORY[0xA7745E4]);
    HIDWORD(v2[58]) = MEMORY[0x5A83950](
                        COERCE_UNSIGNED_INT64(*(double *)&v2[60] + *(double *)&v2[59]),
                        HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v2[60] + *(double *)&v2[59])));
    HIDWORD(v2[104]) = LODWORD(v2[61]) - HIDWORD(v2[58]);
  }
  return (*(int (__fastcall **)(_DWORD, _DWORD))(MEMORY[0x3C72808] + 12))(
           *(_DWORD *)(MEMORY[0x3C72808] + 4),
           MEMORY[0x3C72678]);
}
```

{% endcode %}

{% code title="func3.bin" %}

```c
int __fastcall sub_ADA6B50(int a1, int a2)
{
  int v2; // eax
  int v3; // eax
  _DWORD v5[111]; // [esp+18h] [ebp-1C4h] BYREF

  memset(v5, 0, sizeof(v5));
  v5[28] = a1;
  v5[27] = a2;
  if ( MEMORY[0x1684364] )
    MEMORY[0x620E12A0]();
  v5[70] = 0;
  while ( 1 )
  {
    if ( v5[70] == 3 )
    {
      MEMORY[0x61DB2100]();
      v5[70] = 4;
    }
    if ( v5[70] != 5 )
      goto LABEL_9;
    v5[29] = MEMORY[0x5A050F0](v5[84], MEMORY[0x4F0590C]);
    if ( v5[29] )
      break;
    v5[70] = 6;
LABEL_9:
    if ( v5[70] == 1 )
    {
      (*(void (__fastcall **)(_DWORD))(MEMORY[0x42D26A8] + 12))(*(_DWORD *)(MEMORY[0x42D26A8] + 4));
      v5[70] = 2;
    }
    if ( v5[70] == 2 )
    {
      MEMORY[0x61DB2100]();
      v5[70] = 3;
    }
    if ( v5[70] == 4 )
    {
      v5[84] = MEMORY[0x4F05910];
      v5[70] = 5;
    }
    if ( !v5[70] )
      v5[70] = 1;
    if ( v5[70] == 6 )
    {
      v5[69] = 0;
      goto LABEL_20;
    }
  }
  v5[69] = 1;
LABEL_20:
  v5[83] = v5[69];
  v5[100] = 0;
  MEMORY[0x1684788] = 0;
  MEMORY[0x1463460](23611160, 72);
  v5[2] = MEMORY[0x42D28A8];
  v5[68] = (*(int (__fastcall **)(_DWORD, _DWORD))(MEMORY[0x42D28A8] + 12))(// call Len(val)
             *(_DWORD *)(MEMORY[0x42D28A8] + 4),
             MEMORY[0x42D2670]);
  MEMORY[0x168478C] = v5[68];
  v5[82] = MEMORY[0x4F05914];
  v5[67] = MEMORY[0x5A050F0](MEMORY[0x4F05914], MEMORY[0x4F05918]);
  if ( v5[67] )
    v5[66] = 2;
  else
    v5[66] = 1;
  v5[81] = v5[66];
  v5[98] = 1;
  for ( MEMORY[0x1684790] = 1; MEMORY[0x1684790] <= MEMORY[0x168478C]; MEMORY[0x1684790] = v3 )
  {
    v5[80] = MEMORY[0x4F0591C];
    v5[65] = MEMORY[0x1684788];
    MEMORY[0x1463460](23611160, 72);
    v5[26] = MEMORY[0x42D28AC];
    MEMORY[0x1463460](23611160, 73);
    v5[25] = MEMORY[0x42D28B8];
    v5[24] = MEMORY[0x42D2670];
    v5[64] = MEMORY[0x1684790];
    v5[63] = MEMORY[0x5A050F0](v5[80], MEMORY[0x4F0591C]);
    v5[62] = v5[65];
    v5[23] = v5[26];
    v5[22] = v5[25];
    v5[21] = v5[24];
    v5[61] = v5[64];
    v5[60] = v5[65];
    v5[20] = v5[26];
    v5[19] = v5[25];
    v5[18] = v5[24];
    v5[59] = v5[64];
    if ( v5[63] )
      v5[58] = 1;
    else
      v5[58] = 2;
    v5[79] = v5[58];
    v5[96] = 1;
    v5[17] = (*(int (__fastcall **)(_DWORD, _DWORD, int, _DWORD))(v5[19] + 12))(// call Mid(val, index, 1)
               *(_DWORD *)(v5[19] + 4),
               v5[18],
               1,
               v5[59]);
    v5[57] = (*(int (__fastcall **)(_DWORD, _DWORD))(v5[20] + 12))(*(_DWORD *)(v5[20] + 4), v5[17]);// call AscW(val)
    v2 = v5[57] + v5[60];
    if ( __OFADD__(v5[57], v5[60]) )
      v2 = MEMORY[0x620E0540]();
    MEMORY[0x1684788] = v2;
    v5[78] = MEMORY[0x4F05920];
    v5[56] = MEMORY[0x1684790];
    v5[55] = MEMORY[0x5A050F0](MEMORY[0x4F05920], MEMORY[0x4F05924]);
    v5[54] = v5[56];
    v5[53] = v5[56];
    if ( v5[55] )
      v5[52] = 2;
    else
      v5[52] = 1;
    v5[77] = v5[52];
    v5[94] = 1;
    v3 = v5[53] + 1;
    if ( __OFADD__(1, v5[53]) )
      v3 = MEMORY[0x620E0540]();
  }
  v5[51] = MEMORY[0x1684788];
  *(double *)&v5[49] = MEMORY[0xADA7418];
  *(double *)&v5[47] = MEMORY[0x62363940](MEMORY[0xADA7420], MEMORY[0xADA7424]);
  v5[46] = MEMORY[0x5A83950](
             COERCE_UNSIGNED_INT64(*(double *)&v5[49] - *(double *)&v5[47]),
             HIDWORD(COERCE_UNSIGNED_INT64(*(double *)&v5[49] - *(double *)&v5[47])));
  v5[92] = v5[46];
  MEMORY[0x1684794] = v5[51] % v5[46];
  MEMORY[0x1463460](23611160, 72);
  v5[1] = MEMORY[0x42D28A8];
  v5[45] = (*(int (__fastcall **)(_DWORD, _DWORD))(MEMORY[0x42D28A8] + 12))(// call Len(val)
             *(_DWORD *)(MEMORY[0x42D28A8] + 4),
             MEMORY[0x42D266C]);
  MEMORY[0x1684798] = v5[45];
  MEMORY[0x1463460](23611160, 74);
  v5[16] = (*(int (__fastcall **)(_DWORD, _DWORD, _DWORD))(MEMORY[0x42D28C0] + 12))(// call StringBuilder(val)
             *(_DWORD *)(MEMORY[0x42D28C0] + 4),
             MEMORY[0x1684798],
             MEMORY[0x42D28C0]);
  MEMORY[0x61DB2100]();
  v5[76] = MEMORY[0x4F05928];
  v5[44] = MEMORY[0x5A050F0](MEMORY[0x4F05928], MEMORY[0x4F0592C]);
  if ( v5[44] )
    v5[43] = 2;
  else
    v5[43] = 1;
  v5[75] = v5[43];
  v5[90] = 1;
  for ( MEMORY[0x168479C] = 1; MEMORY[0x168479C] <= MEMORY[0x1684798]; MEMORY[0x168479C] = v5[31] + 1 )
  {
    v5[74] = MEMORY[0x4F05930];
    MEMORY[0x1463460](23611160, 72);
    v5[15] = MEMORY[0x42D28AC];
    MEMORY[0x1463460](23611160, 73);
    v5[14] = MEMORY[0x42D28B8];
    v5[13] = MEMORY[0x42D266C];
    v5[42] = MEMORY[0x168479C];
    v5[41] = MEMORY[0x5A050F0](v5[74], MEMORY[0x4F05934]);
    v5[12] = v5[15];
    v5[11] = v5[14];
    v5[10] = v5[13];
    v5[40] = v5[42];
    v5[9] = v5[15];
    v5[8] = v5[14];
    v5[7] = v5[13];
    v5[39] = v5[42];
    if ( v5[41] )
      v5[38] = 2;
    else
      v5[38] = 1;
    v5[73] = v5[38];
    v5[88] = 1;
    v5[6] = (*(int (__fastcall **)(_DWORD, _DWORD, int, _DWORD))(v5[8] + 12))(*(_DWORD *)(v5[8] + 4), v5[7], 1, v5[39]);// call Mid(val, index, 1)
    v5[37] = (*(int (__fastcall **)(_DWORD, _DWORD))(v5[9] + 12))(*(_DWORD *)(v5[9] + 4), v5[6]);// call AscW(val)
    MEMORY[0x16847A0] = MEMORY[0x1684794] + v5[37];
    v5[5] = MEMORY[0x42D28D8];
    v5[4] = MEMORY[0x42D2674];
    v5[36] = (*(int (__fastcall **)(_DWORD, int))(MEMORY[0x42D28C8] + 12))(// call ChrW(val)
               *(_DWORD *)(MEMORY[0x42D28C8] + 4),
               MEMORY[0x1684794] + v5[37]);
    v5[35] = (*(int (__fastcall **)(_DWORD, _DWORD, _DWORD))(v5[5] + 12))(*(_DWORD *)(v5[5] + 4), v5[4], v5[36]);
    v5[72] = MEMORY[0x4F05938];
    v5[34] = MEMORY[0x168479C];
    v5[33] = MEMORY[0x5A050F0](MEMORY[0x4F05938], MEMORY[0x4F05938]);
    v5[32] = v5[34];
    v5[31] = v5[34];
    if ( v5[33] )
      v5[30] = 1;
    else
      v5[30] = 2;
    v5[71] = v5[30];
    v5[86] = 1;
  }
  return (*(int (__fastcall **)(_DWORD, _DWORD))(MEMORY[0x42D2808] + 12))(
           *(_DWORD *)(MEMORY[0x42D2808] + 4),
           MEMORY[0x42D2674]);
}
```

{% endcode %}

Next, just reconstruct the algorithm in python. To get the modulus, we can do the same approach because the program convert it from Double using internal windows function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fm1FpAprxblBAYLutVqii%2Fimage.png?alt=media&amp;token=83230e1d-2093-4972-a7df-61cfbf962fcd" alt=""><figcaption></figcaption></figure>

```python
import base64

# key
inp = "35 4c 32 67 35 70 69 76 35 4c 69 41 35 4c 69 71 35 35 79 66 35 71 32 6a 35 35 71 45 36 59 43 47 35 5a 43 52 35 62 65 6c 35 36 69 4c 35 62 69 49"
inp = inp.split(" ")

tmp = b""
for i in inp:
	tmp += bytes([(int(i, 16))])

dec = base64.b64decode(tmp)
dec2 = dec.decode('utf-8') 
res = 0
for i in dec2:
	res += ord(i)
res %= 5555

unk = "屁诶西艾勒诶艾杰R1弗艾勒娜IM18HI迪艾杰儿屁艾艾艾altNm" # probably input that we should change ?

cmp1 = ""
for i in unk:
	cmp1 += chr((ord(i) + res) & 0xffff)

check = "懧醜輥蠤塸醜蠤洖׸ח撽蠤塸忂ׯ׳חמ׮ׯ閐蠤洖囥懧蠤蠤蠤؇ؚؒ״ؓ"
cmp2 = "׻ט׼ؐ؊׾װؖ؈ؓ׼ז؉יؚ׵׳׽׳ؠ׾ז׳ؐ׾ח״ؘ׳׽؞ؙ؋ؒןש؊׾׸،׷ؠ׸؛׾חؑ؝؊׼ןׯ״׭כؑ؈ת״،׼׭؍؞؉חמ؝؈ؐ״ן"

print(cmp1 == check)
print(cmp1 == cmp2)
```

If we take a look on existing values, we can see that `cmp2` length has different length with unk length so probably `unk` is our input since variable res or key will not affect the length. With this assumption so let's try to create the decryption.

```python
import base64

inp = "35 4c 32 67 35 70 69 76 35 4c 69 41 35 4c 69 71 35 35 79 66 35 71 32 6a 35 35 71 45 36 59 43 47 35 5a 43 52 35 62 65 6c 35 36 69 4c 35 62 69 49"
inp = inp.split(" ")

tmp = b""
for i in inp:
	tmp += bytes([(int(i, 16))])

dec = base64.b64decode(tmp)
dec2 = dec.decode('utf-8') 
res = 0
for i in dec2:
	res += ord(i)
res %= 5555

cmp2 = "׻ט׼ؐ؊׾װؖ؈ؓ׼ז؉יؚ׵׳׽׳ؠ׾ז׳ؐ׾ח״ؘ׳׽؞ؙ؋ؒןש؊׾׸،׷ؠ׸؛׾חؑ؝؊׼ןׯ״׭כؑ؈ת״،׼׭؍؞؉חמ؝؈ؐ״ן"

flag = ""
for i in cmp2:
	flag += chr((ord(i) - res) & 0xffff)

print(base64.b64decode(flag))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FeR0kpRZU6sFgsgL4UnSy%2Fimage.png?alt=media&amp;token=f893e34a-2509-4389-aa09-fa512d6761f1" alt=""><figcaption></figcaption></figure>

Flag: Securinets{N1c3\_C#\_Sk1llz\_But\_C4n\_Y0u\_H4ndl3\_Th1s\_0n3}
