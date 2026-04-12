import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";

type AppShellProps = {
	children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
	return (
		<div className="min-h-screen lg:pl-[220px] bg-background">
			{/* Ambient glow blobs — dark mode only */}
			<div className="dark:block hidden fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
				<div
					className="absolute top-[15%] -left-[10%] w-[45%] h-[45%] rounded-full"
					style={{ background: 'rgba(196, 114, 142, 0.04)', filter: 'blur(120px)' }}
				/>
				<div
					className="absolute bottom-[10%] -right-[10%] w-[35%] h-[35%] rounded-full"
					style={{ background: 'rgba(196, 114, 142, 0.03)', filter: 'blur(100px)' }}
				/>
			</div>

			<Sidebar />
			<TopNav />
			<main className="w-full max-w-180 lg:max-w-[960px] mx-auto px-6 md:px-12 lg:px-16 pt-8 md:pt-24 lg:pt-12 pb-24 md:pb-16 lg:pb-12">
				{children}
			</main>
			<BottomNav />
		</div>
	);
}
