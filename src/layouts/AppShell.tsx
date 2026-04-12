import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";

type AppShellProps = {
	children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
	return (
		<div className="min-h-screen bg-background">
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

			<TopNav />
			<main className="mx-auto max-w-180 px-6 md:px-12 pt-8 md:pt-24 pb-24 md:pb-16">
				{children}
			</main>
			<BottomNav />
		</div>
	);
}
